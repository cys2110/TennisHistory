<script setup lang="ts">
const { scores } = defineProps<{ scores: GamesSetsLostInterface[] }>()
const route = useRoute()
const colorMode = useColorMode()
const name = computed(() => decodeName(route.params.name as string))

const getColour = (index: number) => CATEGORY_COLOURS[index % CATEGORY_COLOURS.length]

const playerColourMap = computed(() => {
  const uniquePlayers = [...new Set(scores.map(score => score.player.name))]

  return Object.fromEntries(uniquePlayers.map((player, index) => [player, getColour(index)]))
})

const formattedData = computed(() => {
  return scores.map(score => {
    const color = playerColourMap.value[score.player.name]

    return {
      ...score,
      playerName: `${score.player.name} (${score.year})`,
      color
    }
  })
})

const option = ref({
  backgroundColor: "transparent",
  textStyle: { color: colorMode.value === "dark" ? COLOURS.darkText : COLOURS.lightText },
  dataset: {
    source: formattedData.value,
    dimensions: ["playerName", "year", "sets_pc", "games_pc"]
  },
  grid: { containLabel: true },
  tooltip: {
    formatter: (params: any) => {
      const { player, year, sets_pc, games_pc, sets_won, sets_lost, games_won, games_lost, color } = params.data

      return `
        <div>
          <div class="flex justify-between gap-10 font-bold">
            <span>
            <span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${color}"></span>
            ${player.name}
            </span>
            <span>${year}</span>
          </div>
          <div class="flex justify-between">
            <span>${sets_won}/${sets_won + sets_lost} sets</span>
            <span class="font-semibold">${sets_pc}%</span>
          </div>
          <div class="flex justify-between">
            <span>${games_won}/${games_won + games_lost} games</span>
            <span class="font-semibold">${games_pc}%</span>
          </div>
        </div>
      `
    }
  },
  xAxis: {
    min: Math.floor(scores.reduce((min, score) => Math.min(min, score.sets_pc), 100) / 10) * 10,
    max: Math.ceil(scores.reduce((max, score) => Math.max(max, score.sets_pc), 0) / 10) * 10,
    axisLabel: { formatter: (value: number) => `${value}%` },
    name: "Sets Won %",
    splitLine: {
      lineStyle: { color: colorMode.value === "dark" ? COLOURS.lightText : COLOURS.darkText }
    }
  },
  yAxis: {
    min: Math.floor(scores.reduce((min, score) => Math.min(min, score.games_pc), 100) / 10) * 10,
    max: Math.ceil(scores.reduce((max, score) => Math.max(max, score.games_pc), 0) / 10) * 10,
    axisLabel: { formatter: (value: number) => `${value}%` },
    name: "Games Won %",
    splitLine: {
      lineStyle: { color: colorMode.value === "dark" ? COLOURS.lightText : COLOURS.darkText }
    }
  },
  series: [
    {
      type: "scatter",
      symbolSize: 10,
      encode: { x: "sets_pc", y: "games_pc" },
      itemStyle: {
        color: ({ data }: any) => data.color
      }
    }
  ]
})
</script>

<template>
  <u-modal
    :title="name"
    description="Winners by Games and Sets Lost"
    fullscreen
  >
    <u-button
      label="Chart view"
      :icon="ICONS.scatterChart"
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
