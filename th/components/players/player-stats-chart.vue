<script setup lang="ts">
const { stats } = defineProps<{ stats: PlayerStatsInterface[] }>()
const colorMode = useColorMode()

const option = ref({
  backgroundColor: "transparent",
  textStyle: { color: colorMode.value === "dark" ? CHART_COLOURS.darkText : CHART_COLOURS.lightText },
  grid: { containLabel: true },
  dataset: {
    source: stats,
    dimensions: ["category", "value"]
  },
  tooltip: {
    formatter: function (params: any) {
      return `
      <div style="display: flex; justify-content: space-between">
      <span style="font-weight: bold; margin-right: 1rem">${params.data.category}</span>
      <span>${params.value.value}${params.data.suffix === false ? "" : "%"}</span>
      </div>
      `
    }
  },
  xAxis: { type: "value", max: 100 },
  yAxis: { type: "category", inverse: true },
  series: [
    {
      type: "bar",
      encode: { x: "value", y: "category" },
      itemStyle: { color: CHART_COLOURS.violet700 }
    }
  ]
})
</script>

<template>
  <v-chart
    class="h-96 w-full"
    :option="option"
    :autoresize="true"
  />
</template>
