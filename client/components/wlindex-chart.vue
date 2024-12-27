<script setup>
const props = defineProps(['index'])
const categoryColours = {
    'Match Record': '#0284c7',
    'Pressure Points': '#c026d3',
    Environment: '#7c3aed',
    Other: '#059669',
}

const option = ref({
    backgroundColor: 'transparent',
    textStyle: { color: '#71717a' },
    grid: { left: '15%' },
    tooltip: {
        formatter: function (params) {
            const { stat, value: index, wins, losses, titles } = params.value
            return `<span style="font-weight: bold">${stat}</span><br/ >${wins}-${losses} (${index})${titles !== null ? `<br />${titles} ${titles === 1 ? 'title' : 'titles'}` : ''
                }`
        },
    },
    dataset: {
        source: props.index,
        dimensions: ['category', 'stat', 'win', 'loss', 'titles', 'value'],
    },
    xAxis: [{ type: 'value', name: 'Index' }, { type: 'value', name: 'Titles', splitLine: { show: false } }],
    yAxis: { type: 'category', inverse: true },
    series: [
        {
            type: 'bar',
            encode: { x: 'value', y: 'stat' },
            itemStyle: {
                color: function (param) {
                    return categoryColours[param.data.category]
                },
            },
        },
        {
            name: 'Titles',
            type: 'scatter',
            encode: { x: 'titles', y: 'stat' },
            xAxisIndex: 1,
            itemStyle: { color: '#f97316' },
        }
    ],
})
</script>

<template>
    <div>
        <div class="flex justify-center">
            <div v-for="(entry, index) in Object.entries(categoryColours)" :key="index" class="mx-5 flex">
                <div class="rounded-lg !w-9 mx-2" :style="{ backgroundColor: entry[1] }"></div>
                <div class="text-zinc-400 self-center">{{ entry[0] }}</div>
            </div>
        </div>
        <v-chart class="!h-[600px] !w-full" :option="option" :autoresize="true" />
    </div>
</template>