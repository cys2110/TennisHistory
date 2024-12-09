<script setup lang="ts">
import { ref, watch, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery } from '@vue/apollo-composable'
import Select from 'primevue/select'
import { GET_PLAYER_STATS } from '@/services/PlayerService'
import { percentage, unencodeName, updateDocumentTitle } from '@/utils/functions'
import { useGlobalBreakpoints } from '@/utils/useGlobalBreakpoints'

const route = useRoute()
const router = useRouter()
const { isBreakpointOrUp } = useGlobalBreakpoints()

// Variables
const props = defineProps<{
  name: string
  id: string
}>()
const stats: Ref<{ category: string, value: number, suffix?: boolean }[] | null> = ref(null)
const checked = ref(false)
const selectOptions = {
  borderColor: '{cyan.600}',
  focusBorderColor: '{cyan.400}',
}

const selectedYear = ref(route.query.year ? parseInt(route.query.year as string) : null)
const selectedSurface = ref(route.query.surface || null)
const years = ref([{ name: 'Career', value: null }])
const surfaces = [
  { name: 'All', value: null },
  { name: 'Clay', value: 'Clay' },
  { name: 'Grass', value: 'Grass' },
  { name: 'Hard', value: 'Hard' },
  { name: 'Carpet', value: 'Carpet' },
]
const pages = [
  { title: 'Overview', name: 'player' },
  { title: 'Activity', name: 'activity' },
  { title: 'Titles and Finals', name: 'titles' },
  { title: 'Win-Loss Index', name: 'index' }
]

// Update document title
watch(() => props.name, () => updateDocumentTitle(`Stats | ${unencodeName(props.name)} | TennisHistory`), { immediate: true })

// Handle selection
const handleSelection = () => {
  router.push({ query: { year: selectedYear.value, surface: selectedSurface.value } })
}

// API call
// @ts-ignore
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
  <div v-if="stats" class="lg:w-3/4 mx-auto">
    <PageToolbar :pages>
      <template #start>
        <FloatLabel variant="on">
          <Select inputId="year_select" v-model="selectedYear" :options="years" optionLabel="name" placeholder="Year"
            optionValue="value" @change="handleSelection" size="small" :dt="selectOptions" />
          <label for="year_select">Year</label>
        </FloatLabel>
      </template>
      <template #center>
        <SelectButton v-model="selectedSurface" :options="surfaces" optionLabel="name" optionValue="value"
          @change="handleSelection" size="small" style="border: 1px solid var(--p-cyan-400);" />
      </template>
    </PageToolbar>
    <div v-if="isBreakpointOrUp('md')" class="w-full flex justify-end">
      <ToggleButton v-model="checked" offIcon="pi pi-chart-bar" onIcon="pi pi-table" offLabel="" onLabel="" unstyled
        class="mb-5" pt:icon="text-cyan-600 text-3xl" pt:root="border-cyan-600 border-[1px] rounded px-2" />
    </div>
    <DataTable v-if="!checked" :value="stats" size="small" stripedRows class="w-1/2 mx-auto">
      <Column field="category" class="" />
      <Column field="value" class="!text-center">
        <template #body="{ data }">
          <div>{{ data.value }}{{ data.suffix === false ? null : '%' }}</div>
        </template>
      </Column>
    </DataTable>
    <StatsBarChart v-if="checked" :stats />
  </div>
  <Loading v-else :loading>
    <template #none>No stats available</template>
  </Loading>
</template>