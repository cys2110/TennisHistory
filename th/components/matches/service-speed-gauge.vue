<script setup lang="ts">
// @ts-ignore
import kmhToMph from "kmh-to-mph"
const { stat, p1, p2 } = defineProps<{
  stat: { key?: string; label: string; percent?: boolean; value: number[] }
  p1: Pick<PlayerInterface, "name" | "id" | "country">
  p2: Pick<PlayerInterface, "name" | "id" | "country">
}>()
const colorMode = useColorMode()

const kmhData = [
  {
    value: stat.value[0],
    name: stat.label,
    title: { offsetCenter: ["0%", "100%"], color: colorMode.value === "dark" ? CHART_COLOURS.darkText : CHART_COLOURS.lightText },
    detail: {
      offsetCenter: ["-100%", "100%"],
      color: CHART_COLOURS.violet700,
      borderColor: CHART_COLOURS.violet700
    },
    itemStyle: { color: CHART_COLOURS.violet700 }
  },
  {
    value: stat.value[1],
    itemStyle: { color: CHART_COLOURS.emerald700 },
    detail: {
      offsetCenter: ["100%", "100%"],
      color: CHART_COLOURS.emerald700,
      borderColor: CHART_COLOURS.emerald700
    }
  }
]

const option = ref({
  darkMode: colorMode.value === "dark",
  backgroundColor: "transparent",
  series: [
    {
      type: "gauge",
      data: kmhData,
      max: 300,
      axisLine: { show: false },
      axisLabel: {
        distance: 25,
        color: colorMode.value === "dark" ? CHART_COLOURS.darkText : CHART_COLOURS.lightText
      },
      title: { fontSize: 14 },
      detail: {
        width: 60,
        height: 40,
        fontSize: 14,
        lineHeight: 15,
        color: "inherit",
        borderColor: "inherit",
        borderRadius: 10,
        borderWidth: 1,
        formatter: function (value: any) {
          const milesPerHour = kmhToMph(value).toFixed(0)
          return `${value} km/h\n${milesPerHour} mph`
        }
      }
    }
  ]
})
</script>

<template>
  <v-chart
    class="min-h-96"
    :option="option"
    :autoresize="true"
  />
</template>
