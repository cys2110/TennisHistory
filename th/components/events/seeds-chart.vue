<script setup lang="ts">
const { seeds } = defineProps<{ seeds: EventSeedType[] }>()
const flattenedSeeds = computed(() => seeds.map(seed => ({ ...seed, seed: parseInt(seed.seed), rank1: seed.rank1 ? parseInt(seed.rank1) : 0, rank2: seed.rank2 ? parseInt(seed.rank2) : 0 })))

const option = ref({
  backgroundColor: "transparent",
  textStyle: { color: "#cbd5e1" },
  grid: { bottom: "30%" },
  dataset: { source: flattenedSeeds.value, dimensions: ["seed", "rank1", "rank2", "name"] },
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
      itemStyle: { color: "#7c3aed" }
    },
    {
      name: "Rank at event",
      label: {
        show: true,
        formatter: (params: any) => (params.value.rank1 === 0 ? "" : "Event"),
        rotate: 90
      },
      type: "bar",
      encode: { x: "name", y: "rank1" },
      yAxisIndex: 1,
      itemStyle: { color: "#0d9488" }
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
      itemStyle: { color: "#c026d3" }
    }
  ]
})
</script>

<template>
  <v-chart
    ref="chartRef"
    class="!h-[700px] !w-full"
    :option
    :autoresize="true"
  />
</template>
