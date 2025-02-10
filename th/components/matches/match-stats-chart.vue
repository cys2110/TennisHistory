<script setup lang="ts">
const { stats } = defineProps<{ stats: { key?: string; label: string; percent?: boolean; value: number[] }[] }>()
const colorMode = useColorMode()
const p1_name = inject<string>("p1Name")
const p2_name = inject<string>("p2Name")

const axisColor = computed(() => (colorMode.value === "dark" ? "#94a3b8" : "#475569"))

const flattenedStats = computed(() => {
  return stats.map(stat => {
    return {
      category: stat.label,
      p1: stat.percent ? percentage(stat.value[0], stat.value[1]) : percentage(stat.value[0], stat.value[0] + stat.value[1]),
      p2: stat.percent ? percentage(stat.value[2], stat.value[3]) : percentage(stat.value[1], stat.value[0] + stat.value[1])
    }
  })
})

const option = ref({
  backgroundColor: "transparent",
  grid: { left: "15%" },
  textStyle: { color: axisColor.value },
  dataset: {
    source: flattenedStats.value,
    dimensions: ["category", "p1", "p2"]
  },
  xAxis: { type: "value", max: 100, axisLabel: { formatter: "{value}%" } },
  yAxis: { type: "category", inverse: true },
  series: [
    {
      name: p1_name,
      type: "bar",
      encode: { x: "p1", y: "category" },
      itemStyle: { color: "#7c3aed" },
      label: { show: true, color: "#cbd5e1", formatter: "{a}" }
    },
    {
      name: p2_name,
      type: "bar",
      encode: { x: "p2", y: "category" },
      itemStyle: { color: "#0d9488" },
      label: { show: true, color: "#cbd5e1", formatter: "{a}" }
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
