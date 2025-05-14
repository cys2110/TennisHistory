<script setup lang="ts">
const { awards } = defineProps<{ awards: RoundInterface[] }>()
const route = useRoute()
const colorMode = useColorMode()

const flattenedAwards = awards.map(award => ({
  ...award,
  pm: award.pm ? Number(award.pm.replaceAll(",", "")) : 0,
  points: award.points ? Number(award.points.replace(",", "")) : 0
}))
const currency: CurrencyType = awards[0].currency ?? "USD"

const option = ref({
  backgroundColor: "transparent",
  textStyle: { color: colorMode.value === "dark" ? COLOURS.darkText : COLOURS.lightText },
  grid: { containLabel: true },
  dataset: { source: flattenedAwards, dimensions: ["round", "points", "pm", "currency"] },
  tooltip: {
    trigger: "item",
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
    axisLabel: {
      formatter: (value: number) => `${CURRENCIES[currency]}${value.toLocaleString("en-GB")}`
    },
    splitLine: { show: false }
  },
  series: [
    {
      symbolSize: 20,
      type: "scatter",
      encode: { x: "points", y: "pm" },
      itemStyle: { color: COLOURS.violet700 }
    }
  ]
})
</script>

<template>
  <u-modal
    :title="`${route.params.name} ${route.params.year}`"
    description="Seeds"
    fullscreen
  >
    <u-button
      label="Chart view"
      :icon="ICONS.scatterChart"
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
