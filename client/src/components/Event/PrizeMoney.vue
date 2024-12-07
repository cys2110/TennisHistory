<script setup lang="ts">
import { ref, provide, computed } from 'vue'
import { Grid } from 'ant-design-vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { ScatterChart } from 'echarts/charts'
import { DatasetComponent, GridComponent, TooltipComponent } from 'echarts/components'
import VChart, { THEME_KEY } from 'vue-echarts'
import { formatCurrency } from '@/utils/functions'
import { Currency, type EventRound } from '@/utils/types'
import { CHART_OPTIONS, COLOURS } from '@/utils/variables'

const props = defineProps<{ rounds: EventRound[]; currency: Currency }>()
const { useBreakpoint } = Grid
const screens = useBreakpoint()

use([CanvasRenderer, ScatterChart, DatasetComponent, GridComponent, TooltipComponent])
provide(THEME_KEY, 'dark')

const leftGrid = computed(() => (screens.value.xs ? '30%' : '15%'))

const option = ref({
  ...CHART_OPTIONS,
  grid: { left: leftGrid },
  dataset: { source: props.rounds, dimensions: ['round', 'points', 'pm'] },
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'none' },
    formatter: function (params: { value: { round: string; points: number; pm: number } }[]) {
      return `
            <div style="font-weight: bold">${params[0].value.round}</div>
            <div style="display: flex; justify-content: space-between; align-items: center;"><span>Points: </span><span>${params[0].value.points}</span></div>
            <div style="display: flex; justify-content: space-between; align-items: center;"><span>Prize Money:&nbsp</span><span>${formatCurrency(props.currency, params[0].value.pm)}</span></div>`
    },
    backgroundColor: 'transparent',
    textStyle: { color: COLOURS.zinc400 },
  },
  xAxis: {
    type: 'value',
    name: 'Points',
    splitLine: { show: false },
  },
  yAxis: {
    type: 'value',
    name: 'Prize Money',
    axisLabel: { formatter: (value: number) => `${formatCurrency(props.currency, value)}` },
    splitLine: { show: false },
  },
  series: [
    {
      symbolSize: 20,
      type: 'scatter',
      encode: { x: 'points', y: 'pm' },
      itemStyle: { color: COLOURS.violet700 },
    },
  ],
})
</script>

<template>
  <div class="text-4xl" id="awards">Awards</div>
  <v-chart class="!h-[400px] !w-full" :option="option" :autoresize="true" />
</template>