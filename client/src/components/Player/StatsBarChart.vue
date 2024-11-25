<script setup>
import { ref, provide } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import { DatasetComponent, GridComponent, LegendComponent, ToolboxComponent, TooltipComponent } from 'echarts/components'
import { UniversalTransition } from 'echarts/features'
import VChart, { THEME_KEY } from 'vue-echarts'

const props = defineProps(['stats'])

use([
    DatasetComponent,
    ToolboxComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
    BarChart,
    UniversalTransition,
    CanvasRenderer,
])
provide(THEME_KEY, 'dark')

const option = ref({
    grid: { left: '20%' },
    darkMode: true,
    backgroundColor: 'transparent',
    dataset: {
        source: props.stats,
        dimensions: ['category', 'value', 'actualValue', 'max']
    },
    tooltip: {
        formatter: function (params) {
            return `${params.value[params.dimensionNames[2]]} / ${params.value[params.dimensionNames[3]]}<br />${params.value[params.dimensionNames[1]]}%`
        }
    },
    textStyle: { color: "#a1a1aa", fontSize: 14 },
    xAxis: { type: 'value', max: 100 },
    yAxis: { type: 'category', inverse: true },
    series: [
        {
            type: 'bar',
            encode: { x: 'value', y: 'category' },
            itemStyle: { color: '#7c3aed' }
        }
    ]
})
</script>

<template>
    <v-chart class="!h-[600px] !w-full" :option="option" :autoresize="true" />
</template>