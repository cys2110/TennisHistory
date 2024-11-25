<script setup>
import { ref, provide } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart } from 'echarts/charts'
import { TooltipComponent } from 'echarts/components'
import VChart, { THEME_KEY } from 'vue-echarts'

const props = defineProps(['stats'])

use([
    TooltipComponent,
    PieChart,
    CanvasRenderer,
])
provide(THEME_KEY, 'dark')

const option = ref({
    darkMode: true,
    backgroundColor: 'transparent',
    textStyle: { color: "#a1a1aa", fontSize: 14 },
    series: [
        {
            type: 'pie',
            radius: ['40%', '70%'],
            data: props.stats,
            label: { formatter: "{b}: {c}" }
        }
    ]
})
</script>

<template>
    <v-chart class="!h-[600px] !w-full" :option="option" :autoresize="true" />
</template>