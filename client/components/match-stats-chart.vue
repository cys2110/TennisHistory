<script setup>
const props = defineProps(['stats', 'p1_name', 'p2_name'])

const flattenedStats = computed(() => {
    return props.stats.map((stat) => {
        return {
            category: stat.name,
            p1_pc: stat.p1_pc?.low || stat.p1,
            p2_pc: stat.p2_pc?.low || stat.p2,
            p1: stat.p1,
            p2: stat.p2
        }
    })
})

const option = ref({
    backgroundColor: 'transparent',
    textStyle: { color: '#71717a' },
    grid: { left: '20%' },
    dataset: {
        source: flattenedStats,
        dimensions: ['category', 'p1', 'p2', 'p1_pc', 'p2_pc'],
    },
    xAxis: { type: 'value', max: 100, axisLabel: { formatter: '{value}%' } },
    yAxis: { type: 'category', inverse: true },
    tooltip: {
        trigger: 'axis',
        formatter: function (params) {
            let tooltipText = `<div>${params[0].axisValueLabel}</div>`
            tooltipText += `<div style="display: flex; justify-content: space-between; align-items: center;"><span style="margin-right: 10px;">${params[0].marker} ${params[0].seriesName} </span><span style="font-weight: bold; text-align: right;">${params[0].data.p1}</span></div>
                <div style="display: flex; justify-content: space-between; align-items: center;"><span style="margin-right: 10px;">${params[1].marker} ${params[1].seriesName}</span> <span style="font-weight: bold; text-align: right;">${params[1].data.p2}</span></div >`
            return tooltipText
        },
    },
    series: [
        {
            name: props.p1_name,
            type: 'bar',
            encode: { x: 'p1_pc', y: 'category' },
            itemStyle: { color: '#6d28d9' },
        },
        {
            name: props.p2_name,
            type: 'bar',
            encode: { x: 'p2_pc', y: 'category' },
            itemStyle: { color: '#166534' },
        },
    ],
})
</script>

<template>
    <v-chart class="!h-[600px] !w-full" :option="option" :autoresize="true" />
</template>