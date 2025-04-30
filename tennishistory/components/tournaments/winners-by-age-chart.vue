<script setup lang="ts">
const { ages } = defineProps<{ ages: WinnersByAgeInterface[] }>()
const colorMode = useColorMode()

const parseAgeString = (ageStr: string): number => {
  const match = ageStr.match(
    /(?:(\d+)\s+years?)?(?:,\s*)?(?:(\d+)\s+months?)?(?:,\s*)?(?:(\d+)\s+days?)?/
  )

  if (!match) return 0

  const years = parseInt(match[1] ?? "0", 10)
  const months = parseInt(match[2] ?? "0", 10)
  const days = parseInt(match[3] ?? "0", 10)

  const total = years + months / 12 + days / 365

  return parseFloat(total.toFixed(2))
}

const getColour = (index: number) => CATEGORY_COLOURS[index % CATEGORY_COLOURS.length]

const playerColourMap = computed(() => {
  const uniquePlayers = [...new Set(ages.map(age => age.player.name))]

  return Object.fromEntries(uniquePlayers.map((player, index) => [player, getColour(index)]))
})

const formattedData = computed(() => {
  return ages.map(age => {
    const color = playerColourMap.value[age.player.name]

    return {
      age: parseAgeString(age.age),
      stringAge: age.age,
      player: `${age.player.name} (${age.year})`,
      year: age.year,
      playerName: age.player.name,
      color
    }
  })
})

const option = ref({
  backgroundColor: "transparent",
  textStyle: { color: colorMode.value === "dark" ? COLOURS.darkText : COLOURS.lightText },
  grid: { containLabel: true },
  dataset: { source: formattedData.value, dimensions: ["age", "player"] },
  radiusAxis: {
    type: "category",
    axisLabel: {
      show: false
    }
  },
  polar: {
    radius: [30, "80%"]
  },
  angleAxis: {},
  tooltip: {
    formatter: (params: any) => {
      const { stringAge, playerName, year } = params.data
      return `
        <div class="flex flex-col">
          <div class="flex flex-row justify-between font-bold">
            <span>${playerName}</span>
            <span>${year}</span>
          </div>
          <span>${stringAge}</span>
        </div>
      `
    }
  },
  series: {
    type: "bar",
    encode: { radius: "player", angle: "age" },
    coordinateSystem: "polar",
    itemStyle: {
      color: ({ data }: any) => data.color
    },
    label: {
      show: true,
      formatter: "{b}",
      position: "start",
      color: colorMode.value === "dark" ? COLOURS.darkText : COLOURS.lightText
    }
  }
})
</script>

<template>
  <div class="grid grid-cols-5 gap-2 my-5">
    <div
      v-for="(player, index) in Object.entries(playerColourMap)"
      :key="index"
      class="mx-5 flex items-center gap-2"
    >
      <u-icon
        name="zondicons:color-palette"
        :style="{ color: player[1] }"
      />
      <div class="text-(--ui-text-muted) self-center text-xs lg:text-sm">{{ player[0] }}</div>
    </div>
  </div>
  <div class="h-200 w-full my-auto mt-10">
    <v-chart
      :option
      :autoresize="true"
    />
  </div>
</template>
