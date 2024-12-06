<script setup>
import { ref, provide, toRefs } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import { DatasetComponent, GridComponent, TooltipComponent } from 'echarts/components'
import VChart, { THEME_KEY } from 'vue-echarts'
import { CHART_OPTIONS, COLOURS } from '@/utils/variables'

// Variables
const props = defineProps(['player'])
const { lhWins, lhLosses, rhWins, rhLosses, lose1Wins, lose1Losses, win1Wins, win1Losses, outdoorWins, outdoorLosses, outdoorTitles, indoorWins, indoorLosses, indoorTitles, carpetWins, carpetLosses, carpetTitles, hardWins, hardLosses, hardTitles, grassWins, grassLosses, grassTitles, clayWins, clayLosses, clayTitles, set5Wins, set5Losses, deciderWins, deciderLosses, finalsWins, finalsLosses, v10Wins, v10Losses, tbWins, tbLosses, mastersWins, mastersLosses, mastersTitles, gsWins, gsLosses, gsTitles, wins, losses, titles } = toRefs(props.player)
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
    { category: 'Other', stat: 'Vs. Left-Handers', win: lhWins.value, loss: lhLosses.value },
    { category: 'Other', stat: 'Vs. Right-Handers', win: rhWins.value, loss: rhLosses.value },
    { category: 'Other', stat: 'After Losing 1st Set', win: lose1Wins.value, loss: lose1Losses.value },
    { category: 'Other', stat: 'After Winning 1st Set', win: win1Wins.value, loss: win1Losses.value },
    { category: 'Environment', stat: 'Outdoor', win: outdoorWins.value, loss: outdoorLosses.value, titles: outdoorTitles.value },
    { category: 'Environment', stat: 'Indoor', win: indoorWins.value, loss: indoorLosses.value, titles: indoorTitles.value },
    { category: 'Environment', stat: 'Carpet', win: carpetWins.value, loss: carpetLosses.value, titles: carpetTitles.value },
    { category: 'Environment', stat: 'Hard', win: hardWins.value, loss: hardLosses.value, titles: hardTitles.value },
    { category: 'Environment', stat: 'Grass', win: grassWins.value, loss: grassLosses.value, titles: grassTitles.value },
    { category: 'Environment', stat: 'Clay', win: clayWins.value, loss: clayLosses.value, titles: clayTitles.value },
    { category: 'Pressure Points', stat: '5th Set Record', win: set5Wins.value, loss: set5Losses.value },
    { category: 'Pressure Points', stat: 'Deciding Set', win: deciderWins.value, loss: deciderLosses.value },
    { category: 'Pressure Points', stat: 'Finals', win: finalsWins.value, loss: finalsLosses.value },
    { category: 'Pressure Points', stat: 'Versus Top 10', win: v10Wins.value, loss: v10Losses.value },
    { category: 'Pressure Points', stat: 'Tie breaks', win: tbWins.value, loss: tbLosses.value },
    { category: 'Match Record', stat: 'ATP Masters 1000', win: mastersWins.value, loss: mastersLosses.value, titles: mastersTitles.value },
    { category: 'Match Record', stat: 'Grand Slams', win: gsWins.value, loss: gsLosses.value, titles: gsTitles.value },
    { category: 'Match Record', stat: 'Overall', win: wins.value, loss: losses.value, titles: titles.value }
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
            return `${stat}<br/ >W-L: ${wins}-${losses} (${index})${titles >= 0 ? `<br />Titles.value: ${titles}` : ''
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