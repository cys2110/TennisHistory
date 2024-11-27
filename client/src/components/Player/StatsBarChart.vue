<script setup>
import { ref, provide } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import { DatasetComponent, GridComponent, TooltipComponent } from 'echarts/components'
import VChart, { THEME_KEY } from 'vue-echarts'
import { CHART_OPTIONS, COLOURS } from '@/utils/variables'

const props = defineProps(['stats'])

use([DatasetComponent, TooltipComponent, GridComponent, BarChart, CanvasRenderer])
provide(THEME_KEY, 'dark')

const option = ref({
    ...CHART_OPTIONS,
    grid: { left: '20%' },
    dataset: {
        source: props.stats,
        dimensions: ['category', 'value', 'actualValue', 'max']
    },
    tooltip: {
        formatter: function (params) {
            return `${params.value.actualValue} / ${params.value.max} (${params.value.value})%`
        }
    },
    xAxis: { type: 'value', max: 100 },
    yAxis: { type: 'category', inverse: true },
    series: [
        {
            type: 'bar',
            encode: { x: 'value', y: 'category' },
            itemStyle: { color: COLOURS.violet700 }
        }
    ]
})
</script>

<template>
    <v-chart class="!h-[600px] !w-full" :option="option" :autoresize="true" />
</template>