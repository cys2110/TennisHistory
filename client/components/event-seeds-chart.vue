<script setup>
const props = defineProps(['seeds'])
const flattenedSeeds = computed(() => props.seeds.map((seed) => ({ ...seed, seed: seed.seed.low, rank: seed.rank.low })))

const option = ref({
    backgroundColor: 'transparent',
    textStyle: { color: '#71717a' },
    grid: { bottom: '30%', right: '15%' },
    dataset: { source: flattenedSeeds, dimensions: ['seed', 'rank', 'name'] },
    tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
    },
    xAxis: {
        type: 'category',
        axisLabel: { interval: 0 },
    },
    yAxis: [
        { type: 'value', name: 'Seed' },
        { type: 'value', name: 'Rank' },
    ],
    series: [
        {
            name: 'Seed',
            type: 'line',
            encode: { x: 'name', y: 'seed' },
            itemStyle: { color: '#166534' },
        },
        {
            name: 'Rank',
            type: 'bar',
            encode: { x: 'name', y: 'rank' },
            yAxisIndex: 1,
            itemStyle: { color: '#6d28d9' },
        },
    ],
})
</script>

<template>
    <v-chart ref="chartRef" class="!h-[500px] !w-full" :option="option" :autoresize="true" />
</template>