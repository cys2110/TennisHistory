<script setup lang="ts">
import { ref, provide } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import { DatasetComponent, GridComponent, TooltipComponent } from 'echarts/components'
import VChart, { THEME_KEY } from 'vue-echarts'
import { CHART_OPTIONS, COLOURS } from '@/utils/variables'
import type { Index } from '@/utils/types'

// Variables
const props = defineProps<{ index: Index }>()
const categoryColours = {
  'Match Record': COLOURS.sky600,
  'Pressure Points': COLOURS.fuchsia600,
  Environment: COLOURS.violet600,
  Other: COLOURS.green600,
}

use([DatasetComponent, TooltipComponent, GridComponent, BarChart, CanvasRenderer])
provide(THEME_KEY, 'dark')

const option = ref({
  ...CHART_OPTIONS,
  grid: { left: '20%' },
  tooltip: {
    formatter: function (params: any) {
      const stat = params.value.stat
      const index = params.value.value
      const wins = params.value.win
      const losses = params.value.loss
      const titles = params.value.titles
      return `${stat}<br/ >W-L: ${wins}-${losses} (${index})${titles >= 0 ? `<br />Titles.value: ${titles}` : ''
        }`
    },
  },
  dataset: {
    source: props.index,
    dimensions: ['category', 'stat', 'win', 'loss', 'titles', 'value'],
  },
  xAxis: { type: 'value' },
  yAxis: { type: 'category' },
  series: [
    {
      type: 'bar',
      encode: { x: 'value', y: 'stat' },
      itemStyle: {
        color: function (param: any) {
          // @ts-ignore
          return categoryColours[param.data.category]
        },
      },
    },
  ],
})
</script>

<template>
  <div class="flex justify-center">
    <div v-for="(entry, index) in Object.entries(categoryColours)" :key="index" class="mx-5 flex">
      <div class="rounded-lg !w-9 mx-2" :style="{ backgroundColor: entry[1] }"></div>
      <div class="text-zinc-400 self-center">{{ entry[0] }}</div>
    </div>
  </div>
  <v-chart class="!h-[600px] !w-full" :option="option" :autoresize="true" />
</template>