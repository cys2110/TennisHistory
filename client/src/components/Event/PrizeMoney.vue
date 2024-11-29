<script setup>
import { ref, provide } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { ScatterChart } from 'echarts/charts'
import { DatasetComponent, GridComponent, TooltipComponent } from 'echarts/components'
import VChart, { THEME_KEY } from 'vue-echarts'
import { formatCurrency } from '@/utils/functions'
import { CHART_OPTIONS, COLOURS } from '@/utils/variables'

const props = defineProps(['rounds', 'currency'])

use([CanvasRenderer, ScatterChart, DatasetComponent, GridComponent, TooltipComponent])
provide(THEME_KEY, 'dark')

const option = ref({
    ...CHART_OPTIONS,
    dataset: {
        source: props.rounds,
        dimensions: ['round', 'points', 'pm']
    },
    tooltip: {
        formatter: function (params) {
            return `<span style="font-weight: bold">${params.value.round}</span><br/>Points: ${params.value.points}<br/>Prize Money: ${formatCurrency(props.currency, params.value.pm)}`;
        },
        backgroundColor: "transparent",
        textStyle: { color: COLOURS.zinc400 },
    },
    xAxis: {
        type: "value",
        name: "Points",
        splitLine: { show: false },
    },
    yAxis: {
        type: "value",
        name: "Prize Money",
        axisLabel: { formatter: (value) => `${formatCurrency(props.currency, value)}`, },
        splitLine: { show: false },
    },
    series: [
        {
            symbolSize: 20,
            type: "scatter",
            encode: { x: "points", y: "pm" },
            itemStyle: { color: COLOURS.violet700 },
        },
    ],
})
</script>

<template>
    <div class="text-4xl" id="awards">Awards</div>
    <v-chart class="!h-[400px] !w-full" :option="option" :autoresize="true" />
</template>