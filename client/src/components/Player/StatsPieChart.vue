<script setup>
import { ref, provide } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart } from 'echarts/charts'
import VChart, { THEME_KEY } from 'vue-echarts'
import { CHART_OPTIONS } from '@/utils/variables'

const props = defineProps(['stats'])

use([PieChart, CanvasRenderer])
provide(THEME_KEY, 'dark')

const option = ref({
    ...CHART_OPTIONS,
    series: [
        {
            type: 'pie',
            radius: ['40%', '70%'],
            data: props.stats,
            label: { formatter: "{b}: {c}", position: 'inside' }
        }
    ]
})
</script>

<template>
    <v-chart class="!h-[600px] !w-full" :option="option" :autoresize="true" />
</template>