<script setup>
import { ref, provide } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart } from 'echarts/charts'
import { DatasetComponent, GridComponent, ToolboxComponent, TooltipComponent } from 'echarts/components'
import { UniversalTransition } from 'echarts/features'
import VChart, { THEME_KEY } from 'vue-echarts'
import { formatCurrency } from '@/utils/functions'

const props = defineProps(['seeds'])

const flattenedSeeds = props.seeds.map((seed) => ({
    seed: seed.seed,
    rank: seed.rank,
    name: seed.player.full_name,
    countryId: seed.player.country.id,
    countryName: seed.player.country.name,
    id: seed.player.id,
}));

use([
    DatasetComponent,
    ToolboxComponent,
    TooltipComponent,
    GridComponent,
    BarChart,
    LineChart,
    UniversalTransition,
    CanvasRenderer,
]);
provide(THEME_KEY, 'dark')

const option = ref({
    grid: {
        bottom: "30%",
    },
    backgroundColor: 'transparent',
    dataset: {
        source: flattenedSeeds,
        dimensions: [
            "seed",
            "rank",
            "name",
            "countryId",
            "countryName",
            "id",
        ],
    },
    textStyle: { color: "#a1a1aa", fontSize: 14 },
    tooltip: {
        trigger: "axis",
        axisPointer: {
            type: "shadow",
        },
    },
    xAxis: {
        type: "category",
        axisLabel: {
            rotate: 60,
            interval: 0,
        },
    },
    yAxis: [
        {
            type: "value",
            name: "Seed",
        },
        {
            type: "value",
            name: "Rank",
        },
    ],
    series: [
        {
            name: "Seed",
            type: "line",
            encode: { x: "name", y: "seed" },
            itemStyle: { color: "#a1a1aa" },
        },
        {
            name: "Rank",
            type: "bar",
            encode: { x: "name", y: "rank" },
            yAxisIndex: 1,
            itemStyle: { color: "#7c3aed" },
        },
    ]
})
</script>

<template>
    <div id="seeds" class="text-4xl">Seeded Players</div>
    <v-chart class="!h-[400px] !w-full" :option="option" :autoresize="true" />
</template>