<script setup lang="ts">
const props = defineProps<{ stats: PlayerStatsType[] }>();

const flattenedStats = computed(() => {
    return props.stats.map((stat) => {
        return {
            category: stat.category,
            value: stat.value.low,
            suffix: stat.suffix
        };
    });
});

const option = ref({
    backgroundColor: "transparent",
    textStyle: { color: "#71717a" },
    grid: { left: "20%" },
    dataset: {
        source: flattenedStats,
        dimensions: ["category", "value"]
    },
    tooltip: {
        formatter: function (params: any) {
            return `<div style="display: flex; justify-content: space-between"><span style="font-weight: bold; margin-right: 1rem">${params.data.category}</span><span>${params.value.value}${params.data.suffix === false ? "" : "%"}</span></div>`;
        }
    },
    xAxis: { type: "value", max: 100 },
    yAxis: { type: "category", inverse: true },
    series: [
        {
            type: "bar",
            encode: { x: "value", y: "category" },
            itemStyle: { color: "#059669" }
        }
    ]
});
</script>

<template>
    <div>
        <v-chart
            class="!h-[600px] !w-full"
            :option="option"
            :autoresize="true"
        />
    </div>
</template>
