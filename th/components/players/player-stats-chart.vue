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
        <div class="flex justify-between gap-5">
          <span class="font-semibold">${params.data.category}</span>
          <span class="font-extrabold">${params.value.value}${params.data.suffix === false ? "" : "%"}</span>
        </div>
      `
    }
  },
  xAxis: { type: "value", max: 100, splitLine: { lineStyle: { color: colorMode.value === "dark" ? CHART_COLOURS.lightText : CHART_COLOURS.darkText } } },
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
  <div class="h-200 w-full">
    <v-chart
      :option="option"
      :autoresize="true"
    />
  </div>
</template>
