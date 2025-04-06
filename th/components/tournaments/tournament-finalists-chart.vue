<script setup lang="ts">
interface APIResponse {
  finals: number
  losses: number
  player: Pick<PlayerInterface, "id" | "name" | "country">
  wins: number
}
const { finalists } = defineProps<{ finalists: APIResponse[] }>()
const colorMode = useColorMode()
const formattedData = computed(() =>
  finalists.map(finalist => ({
    player: finalist.player.name,
    finals: finalist.finals,
    losses: finalist.losses,
    wins: finalist.wins
  }))
)

const option = ref({
  backgroundColor: "transparent",
  textStyle: { color: colorMode.value === "dark" ? CHART_COLOURS.darkText : CHART_COLOURS.lightText },
  dataset: { source: formattedData.value, dimensions: ["player", "finals", "losses", "wins"] },
  grid: { containLabel: true },
  tooltip: {
    trigger: "axis",
    axisPointer: { type: "shadow" }
  },
  legend: {
    textStyle: {
      color: colorMode.value === "dark" ? CHART_COLOURS.darkText : CHART_COLOURS.lightText
    }
  },
  xAxis: {
    type: "value"
  },
  yAxis: {
    type: "category",
    inverse: true
  },
  series: [
    {
      name: "Runner Up",
      type: "bar",
      stack: "total",
      emphasis: { focus: "series" },
      encode: { x: "losses", y: "player" },
      itemStyle: { color: CHART_COLOURS.emerald700 }
    },
    {
      name: "Titles",
      type: "bar",
      stack: "total",
      emphasis: { focus: "series" },
      encode: { x: "wins", y: "player" },
      itemStyle: { color: CHART_COLOURS.violet700 }
    }
  ]
})
</script>

<template>
  <v-chart
    class="min-h-150 w-full my-auto mt-10"
    :option
    :autoresize="true"
  />
</template>
