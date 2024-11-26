<script setup>
import { ref, provide } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import { DatasetComponent, GridComponent, ToolboxComponent, TooltipComponent } from 'echarts/components'
import { UniversalTransition } from 'echarts/features'
import VChart, { THEME_KEY } from 'vue-echarts'

const props = defineProps(['stats', 'p1', 'p2'])

use([
    DatasetComponent,
    ToolboxComponent,
    TooltipComponent,
    GridComponent,
    BarChart,
    UniversalTransition,
    CanvasRenderer,
])
provide(THEME_KEY, 'dark')

const option = ref({
    grid: {
        left: '20%'
    },
    darkMode: true,
    backgroundColor: 'transparent',
    dataset: {
        source: props.stats,
        dimensions: ['category', 'p1Value', 'p1Actual', 'p1Max', 'p2Value', 'p2actual', 'p2Max']
    },
    textStyle: { color: "#a1a1aa", fontSize: 14 },
    xAxis: { type: 'value' },
    yAxis: { type: 'category', inverse: true },
    tooltip: {
        trigger: 'axis',
        formatter: function (params) {
            let tooltipText = `<div>${params[0].axisValueLabel}</div>`
            if (params[0].data.p1Actual) {
                tooltipText += `<div style="display: flex; justify-content: space-between; align-items: center;"><span style="margin-right: 10px;">${params[0].marker} ${params[0].seriesName} </span><span style="font-weight: bold; text-align: right;">${params[0].data.p1Actual}/${params[0].data.p1Max} (${params[0].data.p1Value}%)</span></div>
                <div style="display: flex; justify-content: space-between; align-items: center;"><span style="margin-right: 10px;">${params[1].marker} ${params[1].seriesName}</span> <span style="font-weight: bold; text-align: right;">${params[1].data.p2Actual}/${params[1].data.p2Max} (${params[1].data.p2Value}%)</span></div >`
            } else {
                tooltipText += `<div style="display: flex; justify-content: space-between; align-items: center;"><span style="margin-right: 10px;">${params[0].marker} ${params[0].seriesName} </span><span style="font-weight: bold; text-align: right;">${params[0].data.p1Value}</span></div>
                <div style="display: flex; justify-content: space-between; align-items: center;"><span style="margin-right: 10px;">${params[1].marker} ${params[1].seriesName}</span> <span style="font-weight: bold; text-align: right;">${params[1].data.p2Value}</span></div >`
            }
            return tooltipText
        }
    },
    series: [
        {
            name: props.p1,
            type: 'bar',
            encode: { x: 'p1Value', y: 'category' },
            itemStyle: { color: "#6d28d9" },
        },
        {
            name: props.p2,
            type: 'bar',
            encode: { x: 'p2Value', y: 'category' },
            itemStyle: { color: "#166534" },
        }
    ]
})
</script>

<template>
    <v-chart class="!w-full" :class="{ '!h-[400px]': stats.length > 3, '!h-[275px]': stats.length < 4 }"
        :option="option" :autoresize="true" />
</template>