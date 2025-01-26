<script setup lang="ts">
// @ts-nocheck
const props = defineProps<{ stats: MatchStatsType[] }>()
const colorMode = useColorMode()
const p1_name = inject<string>("p1Name")
const p2_name = inject<string>("p2Name")

const axisColor = computed(() => {
  return colorMode.value === "dark" ? useCssVar("--color-slate-400").value : useCssVar("--color-slate-600").value
})

const flattenedStats = computed(() => {
  return props.stats.map(stat => {
    return {
      category: stat.name,
      p1_pc: stat.values.length === 4 ? stat.values[1] : stat.values[0] + stat.values[1],
      p2_pc: stat.values.length === 4 ? stat.values[3] : stat.values[0] + stat.values[1],
      p1: stat.values[0],
      p2: stat.values.length === 4 ? stat.values[2] : stat.values[1]
    }
  })
})

const option = ref({
  backgroundColor: "transparent",
  textStyle: { color: axisColor },
  grid: { left: "20%" },
  dataset: {
    source: flattenedStats,
    dimensions: ["category", "p1", "p2", "p1_pc", "p2_pc"]
  },
  xAxis: { type: "value", max: 100, axisLabel: { formatter: "{value}%" } },
  yAxis: { type: "category", inverse: true },
  series: [
    {
      name: p1_name,
      type: "bar",
      encode: { x: "p1_pc", y: "category" },
      itemStyle: { color: useCssVar("--color-violet-700").value }
    },
    {
      name: p2_name,
      type: "bar",
      encode: { x: "p2_pc", y: "category" },
      itemStyle: { color: useCssVar("--color-emerald-700").value }
    }
  ]
})
</script>

<template>
  <v-chart
    class="!h-[600px] !w-full"
    :option="option"
    :autoresize="true"
  />
</template>
