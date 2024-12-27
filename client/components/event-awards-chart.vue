<script setup>
const props = defineProps(['rounds'])
const flattenedRounds = computed(() => props.rounds.map((round) => ({ ...round, pm: round.pm.low, points: round.points.low })))
const currency = props.rounds[0].currency

const options = ref({
    backgroundColor: 'transparent',
    textStyle: { color: '#71717a' },
    grid: { left: '20%' },
    dataset: { source: flattenedRounds, dimensions: ['round', 'points', 'pm', 'currency'] },
    tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'none' },
        formatter: function (params) {
            return `
                <div style="font-weight: bold">${params[0].value.round}</div>
                <div style="display: flex; justify-content: space-between; align-items: center;"><span>Points: </span><span>${params[0].value.points}</span></div>
                <div style="display: flex; justify-content: space-between; align-items: center;"><span>Prize Money:&nbsp</span><span>${CURRENCIES[currency]}${params[0].value.pm.toLocaleString('en-GB')}</span></div>`
        },
        backgroundColor: 'transparent',
        textStyle: { color: '#71717a' },
    },
    xAxis: {
        type: 'value',
        name: 'Points',
        splitLine: { show: false },
        nameLocation: 'middle',
        nameTextStyle: {
            padding: 15
        }
    },
    yAxis: {
        type: 'value',
        name: 'Prize Money',
        axisLabel: { formatter: (value) => `${CURRENCIES[currency]}${value.toLocaleString('en-GB')}` },
        splitLine: { show: false },
    },
    series: [
        {
            symbolSize: 20,
            type: 'scatter',
            encode: { x: 'points', y: 'pm' },
            itemStyle: { color: '#16a34a' },
        },
    ],
})
</script>

<template>
    <v-chart ref="chartRef" class="!h-[500px] !w-full" :option="options" :autoresize="true" />
</template>