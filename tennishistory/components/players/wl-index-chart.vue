<script setup lang="ts">
const { index } = defineProps<{ index: WLIndexInterface[] }>()
const colorMode = useColorMode()

const categoryColours = {
  "Match Record": COLOURS.sky700,
  "Pressure Points": COLOURS.fuchsia600,
  Environment: COLOURS.violet700,
  Other: COLOURS.emerald700
}

const option = ref({
  backgroundColor: "transparent",
  textStyle: { color: colorMode.value === "dark" ? COLOURS.darkText : COLOURS.lightText },
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
    {
      type: "value",
      name: "Index",
      max: 1,
      splitLine: {
        lineStyle: { color: colorMode.value === "dark" ? COLOURS.lightText : COLOURS.darkText }
      }
    },
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
      itemStyle: { color: COLOURS.orange600 }
    }
  ]
})
</script>

<template>
  <v-chart
    class="min-h-200 w-full"
    :option="option"
    :autoresize="true"
  />
</template>
