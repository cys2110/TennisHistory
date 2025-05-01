<script setup lang="ts">
const { finalists } = defineProps<{ finalists: TournamentFinalistsInterface[] }>()
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
  textStyle: { color: colorMode.value === "dark" ? COLOURS.darkText : COLOURS.lightText },
  dataset: { source: formattedData.value, dimensions: ["player", "finals", "losses", "wins"] },
  grid: { containLabel: true },
  tooltip: {
    trigger: "axis",
    axisPointer: { type: "shadow" }
  },
  legend: {
    textStyle: {
      color: colorMode.value === "dark" ? COLOURS.darkText : COLOURS.lightText
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
      itemStyle: { color: COLOURS.emerald700 }
    },
    {
      name: "Titles",
      type: "bar",
      stack: "total",
      emphasis: { focus: "series" },
      encode: { x: "wins", y: "player" },
      itemStyle: { color: COLOURS.violet700 }
    }
  ]
})
</script>

<template>
  <div class="h-200 w-full my-auto mt-10">
    <v-chart
      :option
      :autoresize="true"
    />
  </div>
</template>
