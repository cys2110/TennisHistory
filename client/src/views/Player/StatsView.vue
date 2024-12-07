<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import router from '@/router'
import { useQuery } from '@vue/apollo-composable'
import { GET_PLAYER_STATS } from '@/services/PlayerService'
import { percentage, unencodeName, updateDocumentTitle } from '@/utils/functions'
import { COLOURS } from '@/utils/variables'

const route = useRoute()

// Variables
const props = defineProps(['name', 'id'])
const selectedYear = ref(route.query.year ? parseInt(route.query.year) : null)
const selectedSurface = ref(route.query.surface || null)
const years = ref([{ label: 'Career', value: null }])
const surfaces = [
  { label: 'All', value: null },
  { label: 'Clay', value: 'Clay' },
  { label: 'Grass', value: 'Grass' },
  { label: 'Hard', value: 'Hard' },
  { label: 'Carpet', value: 'Carpet' },
]
const barStats = ref(null)
const pieStats = ref(null)

// Update document title
watch(
  () => props.name,
  () => updateDocumentTitle(`Stats | ${unencodeName(props.name)} | TennisHistory`),
  { immediate: true },
)

// Handle selection
const handleSelection = () =>
  router.push({ query: { year: selectedYear.value, surface: selectedSurface.value } })

// API call
const { query, variables } = GET_PLAYER_STATS(props.id, selectedYear.value, selectedSurface.value)
const { result, loading, error } = useQuery(query, variables)

watch(
  result,
  (newResult) => {
    if (newResult) {
      const playerStats = newResult.players[0].stats
      pieStats.value = [
        { name: 'Aces', value: playerStats.aces, itemStyle: { color: COLOURS.violet700 } },
        { name: 'Double faults', value: playerStats.dfs, itemStyle: { color: COLOURS.green800 } },
      ]
      const rawBarStats = [
        {
          category: '1st serve',
          actualValue: playerStats.serve1,
          max: playerStats.serve1 + playerStats.serve2,
        },
        {
          category: '1st serve points won',
          actualValue: playerStats.serve1_w,
          max: playerStats.serve1,
        },
        {
          category: '2nd serve points won',
          actualValue: playerStats.serve2_w,
          max: playerStats.serve2,
        },
        {
          category: 'Break points won',
          actualValue: playerStats.bps_saved,
          max: playerStats.bps_faced,
        },
        {
          category: 'Service points won',
          actualValue: playerStats.serve1_w + playerStats.serve2_w,
          max: playerStats.serve1 + playerStats.serve2,
        },
        {
          category: '1st serve return points won',
          actualValue: playerStats.ret1_w,
          max: playerStats.ret1,
        },
        {
          category: '2nd serve return points won',
          actualValue: playerStats.ret2_w,
          max: playerStats.ret2,
        },
        {
          category: 'Break points converted',
          actualValue: playerStats.bps_converted,
          max: playerStats.bp_opps,
        },
        {
          category: 'Return points won',
          actualValue: playerStats.ret1_w + playerStats.ret2_w,
          max: playerStats.ret1 + playerStats.ret2,
        },
        {
          category: 'Total points won',
          actualValue:
            playerStats.serve1_w + playerStats.serve2_w + playerStats.ret1_w + playerStats.ret2_w,
          max: playerStats.serve1 + playerStats.serve2 + playerStats.ret1 + playerStats.ret2,
        },
      ]
      barStats.value = rawBarStats.map((stat) => ({
        ...stat,
        value: percentage(stat.actualValue, stat.max),
      }))

      // Set years in dropdown
      const yearsArray = Array.from(
        { length: newResult.players[0].years.latest - newResult.players[0].years.earliest + 1 },
        (_, index) => ({
          label: newResult.players[0].years.earliest + index,
          value: newResult.players[0].years.earliest + index,
        }),
      )
      years.value = [{ label: 'Career', value: null }, ...yearsArray]
    }
  },
  { immediate: true },
)

watch(
  error,
  (newError) => {
    if (newError) console.error(newError)
  },
  { immediate: true },
)
</script>

<template>
  <a-row>
    <a-col :span="18" />
    <a-col :span="3">
      <a-select
        :options="years"
        class="w-[90%] text-center mx-1"
        size="large"
        v-model:value="selectedYear"
        @change="handleSelection"
      />
    </a-col>
    <a-col :span="3">
      <a-select
        :options="surfaces"
        class="w-[90%] text-center"
        size="large"
        v-model:value="selectedSurface"
        @change="handleSelection"
      />
    </a-col>
  </a-row>
  <a-row>
    <a-col :span="6">
      <StatsPieChart v-if="pieStats" :stats="pieStats" />
    </a-col>
    <a-col :span="18">
      <StatsBarChart v-if="barStats" :stats="barStats" />
    </a-col>
  </a-row>
  <Loading v-if="!barStats && !pieStats" :loading>
    <template #none>No stats available</template>
  </Loading>
</template>
