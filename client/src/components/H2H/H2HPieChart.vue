<script setup lang="ts">
import { ref, provide } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart } from 'echarts/charts'
import VChart, { THEME_KEY } from 'vue-echarts'
import { percentage } from '@/utils/functions'
import { CHART_OPTIONS } from '@/utils/variables'

const props = defineProps<{
  stats: { name: string; value: number; itemStyle: { color: string } }[]
}>()

use([PieChart, CanvasRenderer])
provide(THEME_KEY, 'dark')

const option = ref({
  ...CHART_OPTIONS,
  series: [
    {
      type: 'pie',
      radius: ['40%', '60%'],
      data: props.stats,
      label: {
        formatter: function () {
          return `${props.stats[0].value}—${props.stats[1].value}\n${percentage(props.stats[0].value, props.stats[0].value + props.stats[1].value)}%`
        },
        position: 'center',
        fontWeight: 'bolder',
        fontSize: 18,
        lineHeight: 40,
      },
    },
  ],
})
</script>

<template>
  <v-chart class="!h-[350px] !w-full" :option="option" :autoresize="true" />
</template>
