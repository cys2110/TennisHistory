<script setup lang="ts">
const { pm } = defineProps<{ pm: HistoricalPMInterface[] }>()
const route = useRoute()
const colorMode = useColorMode()
const name = computed(() => decodeName(route.params.name as string))
const currency: CurrencyType = pm[0].currency ?? "USD"

const option = ref({
  backgroundColor: "transparent",
  textStyle: { color: colorMode.value === "dark" ? COLOURS.darkText : COLOURS.lightText },
  dataset: { source: pm, dimensions: ["year", "pm", "R128", "R64", "R32", "R16", "QF", "SF", "F", "W"] },
  grid: { containLabel: true },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "cross",
      label: {
        backgroundColor: colorMode.value === "dark" ? COLOURS.lightText : COLOURS.darkText
      }
    },
    valueFormatter: (value: number) => `${CURRENCIES[currency]}${value.toLocaleString("en-GB")}`,
    textStyle: {
      fontWeight: "bold"
    }
  },
  legend: {
    textStyle: {
      color: colorMode.value === "dark" ? COLOURS.darkText : COLOURS.lightText
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
      axisLabel: {
        formatter: (value: number) => `${CURRENCIES[currency]}${value.toLocaleString("en-GB")}`
      }
    },
    {
      type: "value",
      name: "Total Financial Commitment",
      axisLabel: {
        formatter: (value: number) => `${CURRENCIES[currency]}${value.toLocaleString("en-GB")}`
      },
      splitLine: { show: false }
    }
  ],
  series: [
    pm[0].R128 && {
      name: "Round of 128",
      type: "line",
      smooth: true,
      stack: "Total",
      itemStyle: { color: COLOURS.lime500 },
      areaStyle: { color: COLOURS.lime500 },
      emphasis: { focus: "series" },
      encode: { x: "year", y: "R128" },
      yAxisIndex: 0
    },
    pm[0].R64 && {
      name: "Round of 64",
      type: "line",
      smooth: true,
      stack: "Total",
      itemStyle: { color: COLOURS.rose700 },
      areaStyle: { color: COLOURS.rose700 },
      emphasis: { focus: "series" },
      encode: { x: "year", y: "R64" },
      yAxisIndex: 0
    },
    {
      name: "Round of 32",
      type: "line",
      smooth: true,
      stack: "Total",
      itemStyle: { color: COLOURS.sky700 },
      areaStyle: { color: COLOURS.sky700 },
      emphasis: { focus: "series" },
      encode: { x: "year", y: "R32" },
      yAxisIndex: 0
    },
    {
      name: "Round of 16",
      type: "line",
      smooth: true,
      stack: "Total",
      itemStyle: { color: COLOURS.orange600 },
      areaStyle: { color: COLOURS.orange600 },
      emphasis: { focus: "series" },
      encode: { x: "year", y: "R16" },
      yAxisIndex: 0
    },
    {
      name: "QuarterFinals",
      type: "line",
      smooth: true,
      stack: "Total",
      itemStyle: { color: COLOURS.fuchsia600 },
      areaStyle: { color: COLOURS.fuchsia600 },
      emphasis: { focus: "series" },
      encode: { x: "year", y: "QF" },
      yAxisIndex: 0
    },
    {
      name: "Semifinals",
      type: "line",
      smooth: true,
      stack: "Total",
      itemStyle: { color: COLOURS.emerald700 },
      areaStyle: { color: COLOURS.emerald700 },
      emphasis: { focus: "series" },
      encode: { x: "year", y: "SF" },
      yAxisIndex: 0
    },
    {
      name: "Final",
      type: "line",
      smooth: true,
      stack: "Total",
      itemStyle: { color: COLOURS.violet700 },
      areaStyle: { color: COLOURS.violet700 },
      emphasis: { focus: "series" },
      encode: { x: "year", y: "F" },
      yAxisIndex: 0
    },
    {
      name: "Win",
      type: "line",
      smooth: true,
      stack: "Total",
      itemStyle: { color: COLOURS.rose700 },
      areaStyle: { color: COLOURS.rose700 },
      emphasis: { focus: "series" },
      encode: { x: "year", y: "W" },
      yAxisIndex: 0
    },
    {
      name: "Prize Money",
      type: "line",
      smooth: true,
      encode: { x: "year", y: "pm" },
      yAxisIndex: 1,
      itemStyle: { color: COLOURS.cyan300 }
    }
  ].filter(Boolean)
})
</script>

<template>
  <u-modal
    :title="name"
    description="Historical Prize Money"
    fullscreen
  >
    <u-button
      label="Chart view"
      :icon="ICONS.areaChart"
      size="xs"
    />

    <template #body>
      <v-chart
        class="min-h-200 w-full"
        :option
        :autoresize="true"
      />
    </template>
  </u-modal>
</template>
