<script setup>
import { ref, provide } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import { DatasetComponent, GridComponent, TooltipComponent } from 'echarts/components'
import VChart, { THEME_KEY } from 'vue-echarts'
import { CHART_OPTIONS, COLOURS } from '@/utils/variables'

// Variables
const props = defineProps(['player'])
const categoryColours = {
    "Match Record": COLOURS.sky600,
    "Pressure Points": COLOURS.fuchsia600,
    "Environment": COLOURS.violet600,
    "Other": COLOURS.green600
}

const getIndexValue = (win, loss) => {
    return (win / (win + loss)).toFixed(3)
}
const data = [
    { category: 'Other', stat: 'Vs. Left-Handers', win: props.player.lhWins, loss: props.player.lhLosses },
    { category: 'Other', stat: 'Vs. Right-Handers', win: props.player.rhWins, loss: props.player.rhLosses },
    { category: 'Other', stat: 'After Losing 1st Set', win: props.player.lose1Wins, loss: props.player.lose1Losses },
    { category: 'Other', stat: 'After Winning 1st Set', win: props.player.win1Wins, loss: props.player.win1Losses },
    { category: 'Environment', stat: 'Outdoor', win: props.player.outdoorWins, loss: props.player.outdoorLosses, titles: props.player.outdoorTitles },
    { category: 'Environment', stat: 'Indoor', win: props.player.indoorWins, loss: props.player.indoorLosses, titles: props.player.indoorTitles },
    { category: 'Environment', stat: 'Carpet', win: props.player.carpetWins, loss: props.player.carpetLosses, titles: props.player.carpetTitles },
    { category: 'Environment', stat: 'Hard', win: props.player.hardWins, loss: props.player.hardLosses, titles: props.player.hardTitles },
    { category: 'Environment', stat: 'Grass', win: props.player.grassWins, loss: props.player.grassLosses, titles: props.player.grassTitles },
    { category: 'Environment', stat: 'Clay', win: props.player.clayWins, loss: props.player.clayLosses, titles: props.player.clayTitles },
    { category: 'Pressure Points', stat: '5th Set Record', win: props.player.set5Wins, loss: props.player.set5Losses },
    { category: 'Pressure Points', stat: 'Deciding Set', win: props.player.deciderWins, loss: props.player.deciderLosses },
    { category: 'Pressure Points', stat: 'Finals', win: props.player.finalsWins, loss: props.player.finalsLosses },
    { category: 'Pressure Points', stat: 'Versus Top 10', win: props.player.v10Wins, loss: props.player.v10Losses },
    { category: 'Pressure Points', stat: 'Tie breaks', win: props.player.tbWins, loss: props.player.tbLosses },
    { category: 'Match Record', stat: 'ATP Masters 1000', win: props.player.mastersWins, loss: props.player.mastersLosses, titles: props.player.mastersTitles },
    { category: 'Match Record', stat: 'Grand Slams', win: props.player.gsWins, loss: props.player.gsLosses, titles: props.player.gsTitles },
    { category: 'Match Record', stat: 'Overall', win: props.player.wins, loss: props.player.losses, titles: props.player.titles }
]
const processedData = data.map(item => ({ ...item, value: getIndexValue(item.win, item.loss) }))

use([DatasetComponent, TooltipComponent, GridComponent, BarChart, CanvasRenderer])
provide(THEME_KEY, 'dark')

const option = ref({
    ...CHART_OPTIONS,
    grid: { left: "20%" },
    tooltip: {
        formatter: function (params) {
            const stat = params.value.stat;
            const index = params.value.value;
            const wins = params.value.win;
            const losses = params.value.loss;
            const titles = params.value.titles;
            return `${stat}<br/ >W-L: ${wins}-${losses} (${index})${titles >= 0 ? `<br />Titles: ${titles}` : ''
                }`
        },
    },
    dataset: {
        source: processedData,
        dimensions: ['category', 'stat', 'win', 'loss', 'titles', 'value']
    },
    xAxis: { type: 'value' },
    yAxis: { type: 'category', data: data.map(item => item.stat) },
    series: [
        {
            type: 'bar',
            encode: { x: 'value', y: 'stat' },
            itemStyle: {
                color: function (param) {
                    return categoryColours[param.data.category]
                }
            }
        }
    ]
})
</script>

<template>
    <div class="flex justify-center">
        <div v-for="(entry, index) in Object.entries(categoryColours)" :key="index" class="mx-5 flex">
            <div class="rounded-lg !w-9 mx-2" :style="{ backgroundColor: entry[1] }"></div>
            <div class="text-zinc-400">{{ entry[0] }}</div>
        </div>
    </div>
    <v-chart class="!h-[600px] !w-full" :option="option" :autoresize="true" />
</template>