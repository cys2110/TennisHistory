<script setup lang="ts">
const { finalists } = defineProps<{ finalists: TournamentFinalistsInterface[] }>()
const route = useRoute()
const colorMode = useColorMode()
const name = computed(() => decodeName(route.params.name as string))

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
  <u-modal
    :title="name"
    description="Players by No. of Finals"
    fullscreen
  >
    <u-button
      label="Chart view"
      :icon="ICONS.barChart"
      size="xs"
    />

    <template #body>
      <v-chart
        class="min-h-200 w-full"
        :option
        :autoresize="true"
      />
    </template>
  </u-modal>
</template>
