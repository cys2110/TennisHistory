<script setup lang="ts">
const { seeds } = defineProps<{ seeds: SeedType[] }>()
const colorMode = useColorMode()
const flattenedSeeds = computed(() => seeds.map(seed => ({ ...seed, seed: seed.seed ? Number(seed.seed) : "—", rank: seed.rank ? Number(seed.rank) : 0, rank2: seed.rank2 ? Number(seed.rank2) : 0 })))

const option = ref({
  backgroundColor: "transparent",
  textStyle: { color: colorMode.value === "dark" ? CHART_COLOURS.darkText : CHART_COLOURS.lightText },
  grid: { containLabel: true },
  dataset: { source: flattenedSeeds.value, dimensions: ["seed", "rank", "rank2", "name"] },
  tooltip: {
    trigger: "axis"
  },
  xAxis: {
    type: "category",
    axisLabel: { interval: 0, rotate: 45 }
  },
  yAxis: [
    { type: "value", name: "Seed", axisLabel: { interval: 1 }, splitLine: { show: false } },
    { type: "value", name: "Rank", axisLabel: { interval: 5 } }
  ],
  series: [
    {
      name: "Seed",
      type: "line",
      encode: { x: "name", y: "seed" },
      itemStyle: { color: CHART_COLOURS.violet700 }
    },
    {
      name: "Rank at event",
      label: {
        show: true,
        formatter: (params: any) => (params.value.rank === 0 ? "" : "Event"),
        rotate: 90
      },
      type: "bar",
      encode: { x: "name", y: "rank1" },
      yAxisIndex: 1,
      itemStyle: { color: CHART_COLOURS.emerald700 }
    },
    {
      name: "Rank at draw",
      label: {
        show: true,
        formatter: (params: any) => (params.value.rank2 === 0 ? "" : "Draw"),
        rotate: 90
      },
      type: "bar",
      encode: { x: "name", y: "rank2" },
      yAxisIndex: 1,
      itemStyle: { color: CHART_COLOURS.fuchsia600 }
    }
  ]
})
</script>

<template>
  <div class="h-[600px] my-auto">
    <v-chart
      :option
      :autoresize="true"
    />
  </div>
</template>
