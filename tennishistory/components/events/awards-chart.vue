<script setup lang="ts">
const { awards } = defineProps<{ awards: RoundInterface[] }>()
const colorMode = useColorMode()

const flattenedAwards = awards.map(award => ({
  ...award,
  pm: award.pm ? Number(award.pm.replaceAll(",", "")) : 0,
  points: award.points ? Number(award.points.replace(",", "")) : 0
}))
const currency: CurrencyType = awards[0].currency ?? "USD"

const option = ref({
  backgroundColor: "transparent",
  textStyle: { color: colorMode.value === "dark" ? CHART_COLOURS.darkText : CHART_COLOURS.lightText },
  grid: { left: "15%" },
  dataset: { source: flattenedAwards, dimensions: ["round", "points", "pm", "currency"] },
  tooltip: {
    trigger: "item",
    confine: true,
    formatter: (params: any) => {
      return `
          <div class="font-bold">${params.value.round}</div>
          <div class="flex justify-between items-center">
            <span>Points:</span>
            <span>${params.value.points}</span>
          </div>
          <div class="flex justify-between items-center gap-3">
            <span>Prize Money:</span>
            <span>${currency ? CURRENCIES[currency] : ""}${params.value.pm.toLocaleString("en-GB")}</span>
          </div>
      `
    }
  },
  xAxis: {
    type: "value",
    name: "Points",
    splitLine: { show: false },
    axisLabel: { formatter: (value: number) => value.toLocaleString("en-GB") }
  },
  yAxis: {
    type: "value",
    name: "Prize Money",
    axisLabel: { formatter: (value: number) => `${CURRENCIES[currency]}${value.toLocaleString("en-GB")}` },
    splitLine: { show: false }
  },
  series: [
    {
      symbolSize: 20,
      type: "scatter",
      encode: { x: "points", y: "pm" },
      itemStyle: { color: CHART_COLOURS.violet700 }
    }
  ]
})
</script>

<template>
  <v-chart
    ref="chartRef"
    class="!h-[500px] !w-full my-auto"
    :option
    :autoresize="true"
  />
</template>
