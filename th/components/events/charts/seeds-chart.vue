<script setup lang="ts">
const { seeds } = defineProps<{ seeds: SeedType[] }>()
const route = useRoute()
const colorMode = useColorMode()

const flattenedSeeds = computed(() =>
  seeds.map(seed => ({
    ...seed,
    seed: seed.seed ? Number(seed.seed) : "—",
    rank: seed.rank ? Number(seed.rank) : 0,
    rank2: seed.rank2 ? Number(seed.rank2) : 0
  }))
)

const option = ref({
  backgroundColor: "transparent",
  textStyle: { color: colorMode.value === "dark" ? COLOURS.darkText : COLOURS.lightText },
  grid: { containLabel: true },
  dataset: { source: flattenedSeeds.value, dimensions: ["seed", "rank", "rank2", "name"] },
  tooltip: { trigger: "axis" },
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
      itemStyle: { color: COLOURS.violet700 }
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
      itemStyle: { color: COLOURS.emerald700 }
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
      itemStyle: { color: COLOURS.fuchsia600 }
    }
  ]
})
</script>

<template>
  <u-modal
    :title="`${route.params.name} ${route.params.year}`"
    description="Seeds"
    fullscreen
  >
    <u-button
      label="Chart view"
      :icon="ICONS.barChart"
      size="xs"
    />

    <template #body>
      <v-chart
        class="min-h-200 w-full"
        :option
        :autoresize="true"
      />
    </template>
  </u-modal>
</template>
