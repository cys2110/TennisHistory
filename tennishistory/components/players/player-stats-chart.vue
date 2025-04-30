<script setup lang="ts">
const { stats } = defineProps<{ stats: PlayerStatsType[] }>()
const colorMode = useColorMode()

const option = ref({
  backgroundColor: "transparent",
  textStyle: { color: colorMode.value === "dark" ? COLOURS.darkText : COLOURS.lightText },
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
          <span class="font-extrabold">${params.value.value}${
        params.data.suffix === false ? "" : "%"
      }</span>
        </div>
      `
    }
  },
  xAxis: {
    type: "value",
    max: 100,
    splitLine: {
      lineStyle: { color: colorMode.value === "dark" ? COLOURS.lightText : COLOURS.darkText }
    },
    axisLabel: { formatter: "{value}%" }
  },
  yAxis: { type: "category", inverse: true },
  series: [
    {
      type: "bar",
      encode: { x: "value", y: "category" },
      itemStyle: { color: COLOURS.violet700 }
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
