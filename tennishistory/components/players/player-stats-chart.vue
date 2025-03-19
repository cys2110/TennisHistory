<script setup lang="ts">
const props = defineProps<{ stats: PlayerStatsInterface[] }>()
const colorMode = useColorMode()

const flattenedStats = computed(() => {
  return props.stats.map(stat => {
    return {
      category: stat.category,
      value: Number(stat.value),
      suffix: stat.suffix
    }
  })
})

const option = ref({
  backgroundColor: "transparent",
  textStyle: { color: colorMode.value === "dark" ? CHART_COLOURS.darkText : CHART_COLOURS.lightText },
  grid: { left: "20%" },
  dataset: {
    source: flattenedStats,
    dimensions: ["category", "value"]
  },
  tooltip: {
    formatter: function (params: any) {
      return `<div style="display: flex; justify-content: space-between"><span style="font-weight: bold; margin-right: 1rem">${params.data.category}</span><span>${params.value.value}${params.data.suffix === false ? "" : "%"}</span></div>`
    }
  },
  xAxis: { type: "value", max: 100 },
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
  <v-chart
    class="!h-[600px] !w-full"
    :option="option"
    :autoresize="true"
  />
</template>
