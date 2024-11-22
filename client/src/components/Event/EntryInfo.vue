<script setup>
import { ref, provide } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { TreeChart } from 'echarts/charts'
import VChart, { THEME_KEY } from 'vue-echarts'

const props = defineProps(['entryInfo'])

const treeData = {
    name: "Entry Information",
    children: props.entryInfo.map((info) => ({
        name: info.title,
        children: info.array.map((player) => {
            const childNodes = [];
            if (player.properties?.rank)
                childNodes.push({ name: player.properties.rank });
            if (player.properties?.reason)
                childNodes.push({ name: player.properties.reason });

            return {
                name: player.node?.player.full_name || player.player.full_name,
                children: childNodes.length > 0 ? childNodes : undefined,
            };
        }),
    })),
};

use([TreeChart, CanvasRenderer]);
provide(THEME_KEY, 'dark')

const option = ref({
    darkMode: true,
    backgroundColor: 'transparent',
    series: [
        {
            type: "tree",
            data: [treeData],
            top: "1%",
            left: "20%",
            bottom: "1%",
            right: "20%",
            symbolSize: 7,
            label: {
                position: "top",
                verticalAlign: "middle",
                align: "right",
                fontSize: 12,
            },
            leaves: {
                label: {
                    position: "right",
                    verticalAlign: "middle",
                    align: "left",
                },
            },
            itemStyle: { color: "#7c3aed" },
            expandAndCollapse: true,
            animationDuration: 550,
            animationDurationUpdate: 750,
        },
    ],
})
console.log(props.entryInfo)
</script>

<template>
    <div id="entry-info" class="text-4xl">Entry Information</div>
    <v-chart class="!h-[400px] !w-full" :option="option" :autoresize="true" />
</template>