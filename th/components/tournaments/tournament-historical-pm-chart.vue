<script setup lang="ts">
interface APIResponse {
  year: number
  pm: number
  R128?: number
  R64?: number
  R32: number
  R16: number
  QF: number
  SF: number
  F: number
  currency: CurrencyType
  yoy: string
}
const { pm } = defineProps<{ pm: APIResponse[] }>()
const colorMode = useColorMode()
const currency: CurrencyType = pm[0].currency ?? "USD"

const option = ref({
  backgroundColor: "transparent",
  textStyle: { color: colorMode.value === "dark" ? CHART_COLOURS.darkText : CHART_COLOURS.lightText },
  dataset: { source: pm, dimensions: ["year", "pm", "R128", "R64", "R32", "R16", "QF", "SF", "F"] },
  grid: { containLabel: true },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "cross",
      label: {
        backgroundColor: colorMode.value === "dark" ? CHART_COLOURS.lightText : CHART_COLOURS.darkText
      }
    },
    valueFormatter: (value: number) => `${CURRENCIES[currency]}${value.toLocaleString("en-GB")}`,
    textStyle: {
      fontWeight: "bold"
    }
  },
  legend: {
    textStyle: {
      color: colorMode.value === "dark" ? CHART_COLOURS.darkText : CHART_COLOURS.lightText
    }
  },
  xAxis: [
    {
      type: "category",
      name: "Year",
      boundaryGap: false,
      nameLocation: "center",
      nameGap: 30
    }
  ],
  yAxis: [
    {
      type: "value",
      name: "Prize Money",
      axisLabel: { formatter: (value: number) => `${CURRENCIES[currency]}${value.toLocaleString("en-GB")}` }
    },
    {
      type: "value",
      name: "Total Financial Commitment",
      axisLabel: { formatter: (value: number) => `${CURRENCIES[currency]}${value.toLocaleString("en-GB")}` },
      splitLine: { show: false }
    }
  ],
  series: [
    pm[0].R128 && {
      name: "Round of 128",
      type: "line",
      smooth: true,
      stack: "Total",
      itemStyle: { color: CHART_COLOURS.lime500 },
      areaStyle: { color: CHART_COLOURS.lime500 },
      emphasis: { focus: "series" },
      encode: { x: "year", y: "R128" },
      yAxisIndex: 0
    },
    pm[0].R64 && {
      name: "Round of 64",
      type: "line",
      smooth: true,
      stack: "Total",
      itemStyle: { color: CHART_COLOURS.rose700 },
      areaStyle: { color: CHART_COLOURS.rose700 },
      emphasis: { focus: "series" },
      encode: { x: "year", y: "R64" },
      yAxisIndex: 0
    },
    {
      name: "Round of 32",
      type: "line",
      smooth: true,
      stack: "Total",
      itemStyle: { color: CHART_COLOURS.sky700 },
      areaStyle: { color: CHART_COLOURS.sky700 },
      emphasis: { focus: "series" },
      encode: { x: "year", y: "R32" },
      yAxisIndex: 0
    },
    {
      name: "Round of 16",
      type: "line",
      smooth: true,
      stack: "Total",
      itemStyle: { color: CHART_COLOURS.orange600 },
      areaStyle: { color: CHART_COLOURS.orange600 },
      emphasis: { focus: "series" },
      encode: { x: "year", y: "R16" },
      yAxisIndex: 0
    },
    {
      name: "QuarterFinals",
      type: "line",
      smooth: true,
      stack: "Total",
      itemStyle: { color: CHART_COLOURS.fuchsia600 },
      areaStyle: { color: CHART_COLOURS.fuchsia600 },
      emphasis: { focus: "series" },
      encode: { x: "year", y: "QF" },
      yAxisIndex: 0
    },
    {
      name: "Semifinals",
      type: "line",
      smooth: true,
      stack: "Total",
      itemStyle: { color: CHART_COLOURS.emerald700 },
      areaStyle: { color: CHART_COLOURS.emerald700 },
      emphasis: { focus: "series" },
      encode: { x: "year", y: "SF" },
      yAxisIndex: 0
    },
    {
      name: "Final",
      type: "line",
      smooth: true,
      stack: "Total",
      itemStyle: { color: CHART_COLOURS.violet700 },
      areaStyle: { color: CHART_COLOURS.violet700 },
      emphasis: { focus: "series" },
      encode: { x: "year", y: "F" },
      yAxisIndex: 0
    },
    {
      name: "Total Financial Commitment",
      type: "line",
      smooth: true,
      encode: { x: "year", y: "pm" },
      yAxisIndex: 1,
      itemStyle: { color: CHART_COLOURS.cyan300 }
    }
  ].filter(Boolean)
})
</script>

<template>
  <v-chart
    class="min-h-150 w-full my-auto mt-10"
    :option
    :autoresize="true"
  />
</template>
