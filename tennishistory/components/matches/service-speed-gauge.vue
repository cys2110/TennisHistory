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
    title: {
      offsetCenter: ["0%", "100%"],
      color: colorMode.value === "dark" ? COLOURS.darkText : COLOURS.lightText
    },
    detail: {
      offsetCenter: ["-100%", "100%"],
      color: COLOURS.violet700,
      borderColor: COLOURS.violet700
    },
    itemStyle: { color: COLOURS.violet700 }
  },
  {
    value: stat.value[1],
    itemStyle: { color: COLOURS.emerald700 },
    detail: {
      offsetCenter: ["100%", "100%"],
      color: COLOURS.emerald700,
      borderColor: COLOURS.emerald700
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
        color: colorMode.value === "dark" ? COLOURS.darkText : COLOURS.lightText
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
  <div class="h-100">
    <v-chart
      :option="option"
      :autoresize="true"
    />
  </div>
</template>
