<script setup lang="ts">
import { ref, watch, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery } from '@vue/apollo-composable'
import Select from 'primevue/select'
import PlayerStatsTable from '@/components/Player/PlayerStatsTable.vue'
import { GET_PLAYER_STATS } from '@/services/PlayerService'
import { percentage } from '@/utils/functions'
import { useGlobalBreakpoints } from '@/composables/useGlobalBreakpoints'

const route = useRoute()
const router = useRouter()
const { isBreakpointOrUp } = useGlobalBreakpoints()

// Variables
const props = defineProps<{
  name: string
  id: string
  pageNames: { title: string, name: string }[]
}>()
const pages = props.pageNames.filter(page => page.name !== 'stats')
const stats: Ref<{ category: string, value: number, suffix?: boolean }[] | null> = ref(null)
const checked = ref(false)
const selectTheme = { borderColor: '{violet.400}' }
const columns = [
  { field: 'category', header: 'Category' },
  { field: 'value', header: '' },
]

const selectedYear = ref(route.query.year ? parseInt(route.query.year as string) : null)
const selectedSurface = ref(route.query.surface as string || null)
const years = ref([{ name: 'Career', value: null }])
const surfaces = [
  { name: 'All', value: null },
  { name: 'Clay', value: 'Clay' },
  { name: 'Grass', value: 'Grass' },
  { name: 'Hard', value: 'Hard' },
  { name: 'Carpet', value: 'Carpet' },
]

// Handle selection
const handleSelection = () => {
  router.replace({ query: { year: selectedYear.value, surface: selectedSurface.value } })
}

// API call
const { query, variables } = GET_PLAYER_STATS(props.id, selectedYear.value, selectedSurface.value)
const { result, loading, error } = useQuery(query, variables)

watch(result, (newResult) => {
  if (newResult) {
    const playerStats = newResult.players[0].stats
    stats.value = [
      { category: 'Aces', value: playerStats.aces, suffix: false },
      { category: 'Double faults', value: playerStats.dfs, suffix: false },
      { category: '1st serve', value: percentage(playerStats.serve1, playerStats.serve1 + playerStats.serve2) },
      { category: '1st serve points won', value: percentage(playerStats.serve1_w, playerStats.serve1) },
      { category: '2nd serve points won', value: percentage(playerStats.serve2_w, playerStats.serve2) },
      { category: 'Break points won', value: percentage(playerStats.bps_saved, playerStats.bps_faced) },
      { category: 'Service points won', value: percentage(playerStats.serve1_w + playerStats.serve2_w, playerStats.serve1 + playerStats.serve2) },
      { category: '1st serve return points won', value: percentage(playerStats.ret1_w, playerStats.ret1) },
      { category: '2nd serve return points won', value: percentage(playerStats.ret2_w, playerStats.ret2) },
      { category: 'Break points converted', value: percentage(playerStats.bps_converted, playerStats.bp_opps) },
      { category: 'Return points won', value: percentage(playerStats.ret1_w + playerStats.ret2_w, playerStats.ret1 + playerStats.ret2) },
      { category: 'Total points won', value: percentage(playerStats.serve1_w + playerStats.serve2_w + playerStats.ret1_w + playerStats.ret2_w, playerStats.serve1 + playerStats.serve2 + playerStats.ret1 + playerStats.ret2) },
    ]

    // Set years in dropdown
    const yearsArray = Array.from(
      { length: newResult.players[0].years.latest - newResult.players[0].years.earliest + 1 },
      (_, index) => ({
        name: newResult.players[0].years.earliest + index,
        value: newResult.players[0].years.earliest + index,
      }),
    )
    years.value = [{ name: 'Career', value: null }, ...yearsArray]
  }
}, { immediate: true })

watch(error, (newError) => {
  if (newError) console.error(newError)
}, { immediate: true })
</script>

<template>
  <div v-if="stats">
    <PageToolbar :pages />
    <Toolbar>
      <template #start>
        <FloatLabel variant="on">
          <Select :dt="selectTheme" inputId="year_select" v-model="selectedYear" :options="years" optionLabel="name"
            optionValue="value" @change="handleSelection" size="small" class="w-[140%] text-center" />
          <label for="year_select">Year</label>
        </FloatLabel>
      </template>
      <template #end v-if="isBreakpointOrUp('md')">
        <ToggleButtonComponent :checked onIcon="fa-duotone fa-light fa-table" offIcon="fa-duotone fa-light fa-chart-bar"
          @toggle="checked = !checked" />
      </template>
      <template #center>
        <SelectButton v-model="selectedSurface" :options="surfaces" optionLabel="name" optionValue="value"
          @change="handleSelection" size="small" style="border: 1px solid var(--p-violet-400);" />
      </template>
    </Toolbar>
    <PlayerStatsTable :columns="columns" :stats="stats" :checked="checked" />
    <PlayerStatsBarChart v-if="checked" :stats />
  </div>
  <Loading v-else :loading>
    <template #loading>
      <LoadingTable :columns />
    </template>
    <template #none>No stats available</template>
  </Loading>
</template>