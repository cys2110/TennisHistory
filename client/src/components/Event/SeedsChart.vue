<script setup lang="ts">
import { ref, provide, computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart } from 'echarts/charts'
import { DatasetComponent, GridComponent, TooltipComponent } from 'echarts/components'
import VChart, { THEME_KEY } from 'vue-echarts'
import { CHART_OPTIONS, COLOURS } from '@/utils/variables'
import type { Entry } from '@/utils/types'

const props = defineProps<{
  seeds: Pick<Entry, 'seed' | 'rank' | 'player'>[]
}>()

const flattenedSeeds = props.seeds.map((seed) => ({
  seed: seed.seed,
  rank: seed.rank,
  name: seed.player.full_name,
}))

use([DatasetComponent, TooltipComponent, GridComponent, BarChart, LineChart, CanvasRenderer])
provide(THEME_KEY, 'dark')

const option = ref({
  ...CHART_OPTIONS,
  grid: { bottom: '30%', right: '15%' },
  dataset: { source: flattenedSeeds, dimensions: ['seed', 'rank', 'name'] },
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'shadow' },
  },
  xAxis: {
    type: 'category',
    axisLabel: { interval: 0 },
  },
  yAxis: [
    { type: 'value', name: 'Seed' },
    { type: 'value', name: 'Rank' },
  ],
  series: [
    {
      name: 'Seed',
      type: 'line',
      encode: { x: 'name', y: 'seed' },
      itemStyle: { color: COLOURS.green600 },
    },
    {
      name: 'Rank',
      type: 'bar',
      encode: { x: 'name', y: 'rank' },
      yAxisIndex: 1,
      itemStyle: { color: COLOURS.violet700 },
    },
  ],
})
</script>

<template>
  <v-chart class="!h-[600px] !w-full" :option="option" :autoresize="true" />
</template>