<script setup lang="ts">
const { stat } = defineProps<{ stat: { key?: string; label: string; percent?: boolean; value: number[] } }>()
const colorMode = useColorMode()

const axisColor = computed(() => (colorMode.value === "dark" ? "#94a3b8" : "#475569"))
const kmhData = [
  {
    value: stat.value[0],
    name: stat.label,
    title: { offsetCenter: ["0%", "100%"], color: axisColor.value },
    detail: {
      offsetCenter: ["-100%", "100%"],
      color: "#7c3aed",
      borderColor: "#7c3aed"
    },
    itemStyle: { color: "#7c3aed" }
  },
  {
    value: stat.value[1],
    itemStyle: { color: "#0d9488" },
    detail: {
      offsetCenter: ["100%", "100%"],
      color: "#0d9488",
      borderColor: "#0d9488"
    }
  }
]

const option = ref({
  darkMode: true,
  backgroundColor: "transparent",
  series: [
    {
      type: "gauge",
      data: kmhData,
      max: 300,
      axisLine: { show: false },
      axisLabel: {
        distance: 25,
        color: axisColor.value
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
          const milesPerHour = (value / 1.609344).toFixed(0)
          return `${value} km/h\n${milesPerHour} mph`
        }
      }
    }
  ]
})
</script>

<template>
  <v-chart
    class="!h-[400px]"
    :option="option"
    :autoresize="true"
  />
</template>
