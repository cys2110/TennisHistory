<script setup lang="ts">
const props = defineProps<{ stat: MatchStatsType }>()
const colorMode = useColorMode()

const axisColor = computed(() => {
  return colorMode.value === "dark" ? useCssVar("--color-slate-400").value : useCssVar("--color-slate-600").value
})

const kmhData = [
  {
    value: props.stat.values[0],
    name: props.stat.name,
    title: { offsetCenter: ["0%", "100%"], color: "#a1a1aa" },
    detail: {
      offsetCenter: ["-100%", "100%"],
      color: useCssVar("--color-violet-700").value,
      borderColor: useCssVar("--color-violet-700").value
    },
    itemStyle: { color: useCssVar("--color-violet-700").value }
  },
  {
    value: props.stat.values[1],
    itemStyle: { color: useCssVar("--color-emerald-700").value },
    detail: {
      offsetCenter: ["100%", "100%"],
      color: useCssVar("--color-emerald-700").value,
      borderColor: useCssVar("--color-emerald-700").value
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
        color: axisColor
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
    class="!h-[400px] !w-1/3"
    :option="option"
    :autoresize="true"
  />
</template>
