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
  grid: { left: "20%" },
  tooltip: {
    formatter: function (params: any) {
      const { stat, value: index, wins, losses, titles } = params.value
      return `
      <span style="font-weight: bold">${stat}</span>
      <br/ >
      <span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${
        categoryColours[params.data.category as keyof typeof categoryColours]
      }"></span>  ${wins}-${losses} (${index})${
        titles !== null
          ? `<br />
      <span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${CHART_COLOURS.orange600}"></span>
      ${titles} ${titles === 1 ? "title" : "titles"}`
          : ""
      }
      `
    }
  },
  dataset: {
    source: index,
    dimensions: ["category", "stat", "win", "loss", "titles", "value"]
  },
  xAxis: [
    { type: "value", name: "Index", max: 1 },
    { type: "value", name: "Titles", splitLine: { show: false } }
  ],
  yAxis: { type: "category", inverse: true },
  series: [
    {
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
