<script setup>
import { ref, provide } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { GaugeChart } from 'echarts/charts'
import VChart, { THEME_KEY } from 'vue-echarts'

const props = defineProps(['stat'])

use([GaugeChart, CanvasRenderer])
provide(THEME_KEY, 'dark')

const kmhData = [
    {
        value: props.stat.p1,
        name: props.stat.name,
        title: { offsetCenter: ["0%", "100%"], color: "#a1a1aa" },
        detail: {
            offsetCenter: ["-75%", "100%"],
            color: "#6d28d9",
            borderColor: "#6d28d9",
        },
        itemStyle: { color: "#6d28d9" },
    },
    {
        value: props.stat.p2,
        itemStyle: { color: "#166534" },
        detail: {
            offsetCenter: ["75%", "100%"],
            color: "#166534",
            borderColor: "#166534",
        },
    }
]

const option = ref({
    darkMode: true,
    backgroundColor: 'transparent',
    series: [
        {
            type: 'gauge',
            data: kmhData,
            max: 300,
            axisLine: { show: false },
            axisLabel: {
                distance: 25,
                color: '#a1a1aa'
            },
            title: { fontSize: 14 },
            detail: {
                width: 60,
                height: 40,
                fontSize: 14,
                lineHeight: 15,
                color: "inherit",
                borderColor: "inherit",
                borderRadius: 10,
                borderWidth: 1,
                formatter: function (value) {
                    const milesPerHour = (value / 1.609344).toFixed(0);
                    return `${value} km/h\n${milesPerHour} mph`;
                },
            }
        }
    ]
})
</script>

<template>
    <v-chart class="!h-[400px] !w-1/3" :option="option" :autoresize="true" />
</template>