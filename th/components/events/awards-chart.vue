<script setup lang="ts">
const { awards } = defineProps<{ awards: EventAwardType[] }>()

const flattenedAwards = awards.map(award => ({
  ...award,
  pm: award.pm ? parseInt(award.pm.replace(",", "")) : 0,
  points: award.points ? parseInt(award.points.replace(",", "")) : 0
}))
const currency: CurrencyType | null = awards[0].currency

const option = ref({
  backgroundColor: "transparent",
  textStyle: { color: "#cbd5e1" },
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
    splitLine: { show: false }
  },
  yAxis: {
    type: "value",
    name: "Prize Money",
    axisLabel: { formatter: (value: number) => `${currency ? CURRENCIES[currency] : ""}${value.toLocaleString("en-GB")}` },
    splitLine: { show: false }
  },
  series: [
    {
      symbolSize: 20,
      type: "scatter",
      encode: { x: "points", y: "pm" },
      itemStyle: { color: "#7c3aed" }
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
