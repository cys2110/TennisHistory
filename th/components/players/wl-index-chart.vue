<script setup lang="ts">
const { index } = defineProps<{ index: WLIndexInterface[] }>()
const colorMode = useColorMode()

const categoryColours = {
  "Match Record": CHART_COLOURS.sky700,
  "Pressure Points": CHART_COLOURS.fuchsia600,
  Environment: CHART_COLOURS.violet700,
  Other: CHART_COLOURS.emerald700
}

const option = ref({
  backgroundColor: "transparent",
  textStyle: { color: colorMode.value === "dark" ? CHART_COLOURS.darkText : CHART_COLOURS.lightText },
  grid: { containLabel: true },
  tooltip: {
    trigger: "axis",
    textStyle: { fontWeight: "bold" }
  },
  dataset: {
    source: index,
    dimensions: ["category", "stat", "win", "loss", "titles", "value"]
  },
  xAxis: [
    { type: "value", name: "Index", max: 1, splitLine: { lineStyle: { color: colorMode.value === "dark" ? CHART_COLOURS.lightText : CHART_COLOURS.darkText } } },
    { type: "value", name: "Titles", splitLine: { show: false } }
  ],
  yAxis: { type: "category", inverse: true },
  series: [
    {
      name: "Index",
      type: "bar",
      encode: { x: "value", y: "stat" },
      itemStyle: {
        color: function (param: any) {
          return categoryColours[param.data.category as keyof typeof categoryColours]
        }
      }
    },
    {
      name: "Titles",
      type: "scatter",
      encode: { x: "titles", y: "stat" },
      xAxisIndex: 1,
      itemStyle: { color: CHART_COLOURS.orange600 }
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
