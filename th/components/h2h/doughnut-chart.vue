<script setup lang="ts">
const { p1Wins, p2Wins } = defineProps<{ p1Wins: number; p2Wins: number }>()
const colorMode = useColorMode()

const formattedData = computed(() => {
  return [
    { value: p1Wins, itemStyle: { color: CHART_COLOURS.violet700 } },
    { value: p2Wins, itemStyle: { color: CHART_COLOURS.emerald700 } }
  ]
})

const option = ref({
  backgroundColor: "transparent",
  darkMode: colorMode.value === "dark",
  textStyle: { color: colorMode.value === "dark" ? CHART_COLOURS.lightText : CHART_COLOURS.darkText },
  series: [
    {
      type: "pie",
      radius: ["80%", "90%"],
      data: formattedData.value,
      label: {
        formatter: function () {
          return `${p1Wins}—${p2Wins}\n${percentage(p1Wins, p1Wins + p2Wins)}%`
        },
        position: "center",
        fontWeight: "bolder",
        fontSize: 18,
        lineHeight: 40
      }
    }
  ]
})
</script>

<template>
  <v-chart
    class="mb-10 h-96"
    :option="option"
    :autoresize="true"
  />
</template>
