<script setup>
import { ref, provide } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import { DatasetComponent, GridComponent, ToolboxComponent, TooltipComponent } from 'echarts/components'
import { UniversalTransition } from 'echarts/features'
import VChart, { THEME_KEY } from 'vue-echarts'

const props = defineProps(['player'])
console.log(props.player)

const getIndexValue = (win, loss) => {
    return (win / (win + loss)).toFixed(3)
}

const categoryColours = {
    "Match Record": { code: '#0284c7', color: 'bg-sky-600' },
    "Pressure Points": { code: '#c026d3', color: 'bg-fuchsia-600' },
    "Environment": { code: '#7c3aed', color: 'bg-violet-600' },
    "Other": { code: '#16a34a', color: 'bg-green-600' }
}

const data = [
    {
        category: 'Other',
        stat: 'Vs. Left-Handers',
        win: props.player.lhWins,
        loss: props.player.lhLosses,
        value: getIndexValue(props.player.lhWins, props.player.lhLosses)
    },
    {
        category: 'Other',
        stat: 'Vs. Right-Handers',
        win: props.player.rhWins,
        loss: props.player.rhLosses,
        value: getIndexValue(props.player.rhWins, props.player.rhLosses)
    },
    {
        category: 'Other',
        stat: 'After Losing 1st Set',
        win: props.player.lose1Wins,
        loss: props.player.lose1Losses,
        value: getIndexValue(props.player.lose1Wins, props.player.lose1Losses)
    },
    {
        category: 'Other',
        stat: 'After Winning 1st Set',
        win: props.player.win1Wins,
        loss: props.player.win1Losses,
        value: getIndexValue(props.player.win1Wins, props.player.win1Losses)
    },
    {
        category: 'Environment',
        stat: 'Outdoor',
        win: props.player.outdoorWins,
        loss: props.player.outdoorLosses,
        value: getIndexValue(props.player.outdoorWins, props.player.outdoorLosses),
        titles: props.player.outdoorTitles
    },
    {
        category: 'Environment',
        stat: 'Indoor',
        win: props.player.indoorWins,
        loss: props.player.indoorLosses,
        value: getIndexValue(props.player.indoorWins, props.player.indoorLosses),
        titles: props.player.indoorTitles
    },
    {
        category: 'Environment',
        stat: 'Carpet',
        win: props.player.carpetWins,
        loss: props.player.carpetLosses,
        value: getIndexValue(props.player.carpetWins, props.player.carpetLosses),
        titles: props.player.carpetTitles
    },
    {
        category: 'Environment',
        stat: 'Hard',
        win: props.player.hardWins,
        loss: props.player.hardLosses,
        value: getIndexValue(props.player.hardWins, props.player.hardLosses),
        titles: props.player.hardTitles
    },
    {
        category: 'Environment',
        stat: 'Grass',
        win: props.player.grassWins,
        loss: props.player.grassLosses,
        value: getIndexValue(props.player.grassWins, props.player.grassLosses),
        titles: props.player.grassTitles
    },
    {
        category: 'Environment',
        stat: 'Clay',
        win: props.player.clayWins,
        loss: props.player.clayLosses,
        value: getIndexValue(props.player.clayWins, props.player.clayLosses),
        titles: props.player.clayTitles
    },
    {
        category: 'Pressure Points',
        stat: '5th Set Record',
        win: props.player.set5Wins,
        loss: props.player.set5Losses,
        value: getIndexValue(props.player.set5Wins, props.player.set5Losses)
    },
    {
        category: 'Pressure Points',
        stat: 'Deciding Set',
        win: props.player.deciderWins,
        loss: props.player.deciderLosses,
        value: getIndexValue(props.player.deciderWins, props.player.deciderLosses)
    },
    {
        category: 'Pressure Points',
        stat: 'Finals',
        win: props.player.finalsWins,
        loss: props.player.finalsLosses,
        value: getIndexValue(props.player.finalsWins, props.player.finalsLosses)
    },
    {
        category: 'Pressure Points',
        stat: 'Versus Top 10',
        win: props.player.v10Wins,
        loss: props.player.v10Losses,
        value: getIndexValue(props.player.v10Wins, props.player.v10Losses)
    },
    {
        category: 'Pressure Points',
        stat: 'Tie breaks',
        win: props.player.tbWins,
        loss: props.player.tbLosses,
        value: getIndexValue(props.player.tbWins, props.player.tbLosses)
    },
    {
        category: 'Match Record',
        stat: 'ATP Masters 1000',
        win: props.player.mastersWins,
        loss: props.player.mastersLosses,
        titles: props.player.mastersTitles,
        value: getIndexValue(props.player.mastersWins, props.player.mastersLosses)
    },
    {
        category: 'Match Record',
        stat: 'Grand Slams',
        win: props.player.gsWins,
        loss: props.player.gsLosses,
        titles: props.player.gsTitles,
        value: getIndexValue(props.player.gsWins, props.player.gsLosses)
    },
    {
        category: 'Match Record',
        stat: 'Overall',
        win: props.player.wins,
        loss: props.player.losses,
        titles: props.player.titles,
        value: getIndexValue(props.player.wins, props.player.losses)
    }
]

use([
    DatasetComponent,
    ToolboxComponent,
    TooltipComponent,
    GridComponent,
    BarChart,
    UniversalTransition,
    CanvasRenderer,
])
provide(THEME_KEY, 'dark')

const option = ref({
    grid: {
        left: "20%"
    },
    darkMode: true,
    backgroundColor: 'transparent',
    tooltip: {
        formatter: function (params) {
            const stat = params.value[params.dimensionNames[1]];
            const index = params.value[params.dimensionNames[5]];
            const wins = params.value[params.dimensionNames[2]];
            const losses = params.value[params.dimensionNames[3]];
            const titles = params.value[params.dimensionNames[4]];
            return `${stat}<br/ >Index: ${index}<br />W-L: ${wins}-${losses}${titles ? `<br />Titles: ${titles}` : ''
                }`
        },
    },
    dataset: {
        source: data,
        dimensions: ['category', 'stat', 'win', 'loss', 'titles', 'value']
    },
    textStyle: { color: "#a1a1aa", fontSize: 14 },
    xAxis: { type: 'value' },
    yAxis: { type: 'category', data: data.map(item => item.stat) },
    series: [
        {
            type: 'bar',
            encode: { x: 'value', y: 'stat' },
            itemStyle: {
                color: function (param) {
                    const category = param.data.category
                    return categoryColours[category].code
                }
            }
        }
    ]
})
</script>

<template>
    <div class="flex justify-center">
        <div v-for="(entry, index) in Object.entries(categoryColours)" :key="index" class="mx-5 flex">
            <div class="rounded-lg !w-9 mx-2" :class="entry[1].color"></div>
            <div class="text-zinc-400">{{ entry[0] }}</div>
        </div>
    </div>
    <v-chart class="!h-[600px] !w-full" :option="option" :autoresize="true" />
</template>