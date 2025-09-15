<script setup lang="ts">
const { index } = defineProps<{
  index: WLIndexInterface[]
}>()
const { icons, colours } = useAppConfig()
const colorMode = useColorMode()
const playerName = useState<string>("playerName")

const stats = useArrayUnique(index.map(i => i.stat))

const totalIndex = computed(() => {
  const indexByStat: any[] = []
  stats.value.forEach(stat => {
    const relevantStats = index.filter(i => i.stat === stat)
    const totalWins = relevantStats.reduce((sum, i) => sum + (i.wins ?? 0), 0)
    const totalLosses = relevantStats.reduce((sum, i) => sum + (i.losses ?? 0), 0)

    const totalIndex = totalWins / (totalWins + totalLosses)
    indexByStat.push(Number(totalIndex.toFixed(3)))
  })
  return indexByStat
})

const totalTitles = computed(() => {
  const titlesByStat: any[] = []
  stats.value.forEach(stat => {
    const total = index
      .filter(i => i.stat === stat)
      .reduce((sum, i) => {
        return sum + (i.titles ?? 0)
      }, 0)
    titlesByStat.push(total)
  })
  return titlesByStat
})

const option = ref({
  backgroundColor: "transparent",
  textStyle: { color: colorMode.value === "dark" ? colours.darkText : colours.lightText },
  grid: { containLabel: true },
  tooltip: {
    trigger: "axis",
    textStyle: { fontWeight: "bold" }
  },
  legend: {
    textStyle: { color: colorMode.value === "dark" ? colours.darkText : colours.lightText }
  },
  xAxis: [
    {
      type: "value",
      name: "Index",
      max: 1,
      splitLine: {
        lineStyle: { color: colorMode.value === "dark" ? colours.lightText : colours.darkText }
      }
    },
    { type: "value", name: "Titles", splitLine: { show: false } }
  ],
  yAxis: { type: "category", inverse: true, data: useArrayUnique(index.map(i => i.stat)) },
  series: [
    {
      name: "Total Index",
      type: "bar",
      encode: { x: "value", y: "stat" },
      data: totalIndex.value,
      itemStyle: { color: colours.violet700 }
    },
    {
      name: "Tour Main",
      type: "bar",
      encode: { x: "value", y: "stat" },
      data: index.filter(i => i.level === "Tour" && i.draw === "Main").map(i => Number(i.value.toFixed(3))),
      itemStyle: { color: colours.pink600 }
    },
    {
      name: "Tour Qualifying",
      type: "bar",
      encode: { x: "value", y: "stat" },
      data: index.filter(i => i.level === "Tour" && i.draw === "Qualifying").map(i => Number(i.value.toFixed(3)))
    },
    {
      name: "Challenger Main",
      type: "bar",
      encode: { x: "value", y: "stat" },
      data: index.filter(i => i.level === "Challenger" && i.draw === "Main").map(i => Number(i.value.toFixed(3)))
    },
    {
      name: "Challenger Qualifying",
      type: "bar",
      encode: { x: "value", y: "stat" },
      data: index.filter(i => i.level === "Challenger" && i.draw === "Qualifying").map(i => Number(i.value.toFixed(3)))
    },
    {
      name: "ITF Main",
      type: "bar",
      encode: { x: "value", y: "stat" },
      data: index.filter(i => i.level === "ITF" && i.draw === "Main").map(i => Number(i.value.toFixed(3)))
    },
    {
      name: "ITF Qualifying",
      type: "bar",
      encode: { x: "value", y: "stat" },
      data: index.filter(i => i.level === "ITF" && i.draw === "Qualifying").map(i => Number(i.value.toFixed(3)))
    },
    {
      name: "Total Titles",
      type: "scatter",
      encode: { x: "value", y: "stat" },
      xAxisIndex: 1,
      data: totalTitles.value
    },
    {
      name: "Tour Titles",
      type: "scatter",
      encode: { x: "value", y: "stat" },
      xAxisIndex: 1,
      data: index.filter(i => i.level === "Tour" && i.draw === "Main").map(i => i.titles)
    },
    {
      name: "Challenger Titles",
      type: "scatter",
      encode: { x: "value", y: "stat" },
      xAxisIndex: 1,
      data: index.filter(i => i.level === "Challenger" && i.draw === "Main").map(i => i.titles)
    },
    {
      name: "ITF Titles",
      type: "scatter",
      encode: { x: "value", y: "stat" },
      xAxisIndex: 1,
      data: index.filter(i => i.level === "ITF" && i.draw === "Main").map(i => i.titles)
    }
  ]
})
</script>

<template>
  <u-modal
    :title="playerName"
    description="Win-Loss Index"
    fullscreen
  >
    <u-button
      label="Chart view"
      :icon="icons.barChart"
      size="sm"
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
