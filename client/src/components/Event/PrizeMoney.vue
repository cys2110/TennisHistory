<script setup>
import { ref, provide } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { ScatterChart } from 'echarts/charts'
import { DatasetComponent, GridComponent, TooltipComponent } from 'echarts/components'
import VChart, { THEME_KEY } from 'vue-echarts'
import { formatCurrency } from '@/utils/functions'

const props = defineProps(['rounds', 'currency'])

use([CanvasRenderer, ScatterChart, DatasetComponent, GridComponent, TooltipComponent])
provide(THEME_KEY, 'dark')

const option = ref({
    dataset: {
        source: props.rounds,
        dimensions: ['round', 'points', 'pm']
    },
    textStyle: { color: "#a1a1aa", fontSize: 12 },
    backgroundColor: 'transparent',
    tooltip: {
        formatter: function (params) {
            return `${params.value[params.dimensionNames[0]]}<br/>Points: ${params.value[params.dimensionNames[1]]
                }<br/>Prize Money: ${formatCurrency(
                    props.currency,
                    params.value[params.dimensionNames[2]]
                )}`;
        },
        backgroundColor: "transparent",
        textStyle: { color: "#a1a1aa" },
    },
    xAxis: {
        type: "value",
        name: "Points",
        splitLine: { show: false },
    },
    yAxis: {
        type: "value",
        name: "Prize Money",
        axisLabel: {
            formatter: (value) => `${formatCurrency(props.currency, value)}`,
        },
        splitLine: { show: false },
    },
    series: [
        {
            symbolSize: 20,
            type: "scatter",
            encode: { x: "points", y: "pm" },
            itemStyle: { color: "#7c3aed" },
        },
    ],
})
</script>

<template>
    <div class="text-4xl" id="awards">Awards</div>
    <v-chart class="!h-[400px] !w-full" :option="option" :autoresize="true" />
</template>