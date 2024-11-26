<script setup>
import { ref, provide } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart } from 'echarts/charts'
import VChart, { THEME_KEY } from 'vue-echarts'
import { percentage } from '@/utils/functions'

const props = defineProps(['stats'])

use([PieChart, CanvasRenderer])
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
            label: {
                formatter: function () {
                    return `${props.stats[0].value}—${props.stats[1].value}\n${percentage(props.stats[0].value, props.stats[0].value + props.stats[1].value).toFixed(0)}%`
                },
                position: 'center',
                fontWeight: 'bolder',
                fontSize: 18,
                lineHeight: 40
            }
        }
    ]
})
</script>

<template>
    <v-chart class="!h-[350px] !w-full" :option="option" :autoresize="true" />
</template>