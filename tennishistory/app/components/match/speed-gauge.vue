<script setup lang="ts">
const { stat } = defineProps<{
  stat: MatchStatsInterface
}>()
const colorMode = useColorMode()
const { colours } = useAppConfig()

const kmhData = [
  {
    value: stat.p1,
    name: stat.label,
    title: {
      offsetCenter: ["0%", "100%"],
      color: colorMode.value === "dark" ? colours.darkText : colours.lightText
    },
    detail: {
      offsetCenter: ["-100%", "100%"],
      color: colours.indigo700,
      borderColor: colours.indigo700
    },
    itemStyle: { color: colours.indigo700 }
  },
  {
    value: stat.p2,
    itemStyle: { color: colours.fuchsia600 },
    detail: {
      offsetCenter: ["100%", "100%"],
      color: colours.fuchsia600,
      borderColor: colours.fuchsia600
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
        color: colorMode.value === "dark" ? colours.darkText : colours.lightText
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
    class="min-h-200 w-full"
    :option
    :autoresize="true"
  />
</template>
