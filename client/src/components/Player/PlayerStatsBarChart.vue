<script setup lang="ts">
import { ref, provide } from 'vue'
import { $dt } from '@primevue/themes'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import { DatasetComponent, GridComponent, TooltipComponent } from 'echarts/components'
import VChart, { THEME_KEY } from 'vue-echarts'
import { CHART_OPTIONS } from '@/utils/variables'
import { useGlobalBreakpoints } from '@/composables/useGlobalBreakpoints'

const { isBreakpointOrUp } = useGlobalBreakpoints()

const props = defineProps<{
  stats: { category: string, value: number, suffix?: boolean }[]
}>()

use([DatasetComponent, TooltipComponent, GridComponent, BarChart, CanvasRenderer])
provide(THEME_KEY, 'dark')

const option = ref({
  ...CHART_OPTIONS,
  grid: { left: isBreakpointOrUp('lg') ? '20%' : '30%' },
  dataset: {
    source: props.stats,
    dimensions: ['category', 'value', 'actualValue', 'max'],
  },
  tooltip: {
    formatter: function (params: any) {
      return `<span style="font-weight: bold">${params.data.category}</span><br/>${params.value.value}${params.data.suffix === false ? '' : '%'}`
    },
  },
  xAxis: { type: 'value', max: 100 },
  yAxis: { type: 'category', inverse: true },
  series: [
    {
      type: 'bar',
      encode: { x: 'value', y: 'category' },
      itemStyle: { color: $dt('emerald.600').value },
    },
  ],
})
</script>

<template>
  <v-chart class="!h-[600px] !w-full" :option="option" :autoresize="true" />
</template>