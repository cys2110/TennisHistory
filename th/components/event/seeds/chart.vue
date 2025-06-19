<script setup lang="ts">
const { seeds, tours } = defineProps<{ seeds: APISeedsResponseType; tours: TourType[] }>()
const colorMode = useColorMode()
const { colours, icons } = useAppConfig()
const {
  params: { name: paramName, year }
} = useRoute()
const name = computed(() => decodeName(paramName as string))

const uniqueSeeds = [...useArrayUnique(seeds.mainSeeds.map(s => s.seed)).value, ...useArrayUnique(seeds.qualSeeds.map(s => `Q${s.seed}`)).value]

const dataSet = computed(() => {
  const atpSingles = uniqueSeeds.map(seed => {
    if (typeof seed === "string") {
      const qualSeed = seeds.qualSeeds.find(s => `Q${s.seed}` === seed && s.type === "Singles" && s.tour === "ATP")
      return {
        rank: qualSeed ? qualSeed.rank : null,
        name: qualSeed ? qualSeed.name : null
      }
    } else {
      const mainSeed = seeds.mainSeeds.find(s => s.seed === seed && s.type === "Singles" && s.tour === "ATP")
      return {
        rank: mainSeed ? mainSeed.rank : null,
        name: mainSeed ? mainSeed.name : null
      }
    }
  })
  const wtaSingles = uniqueSeeds.map(seed => {
    if (typeof seed === "string") {
      const qualSeed = seeds.qualSeeds.find(s => `Q${s.seed}` === seed && s.type === "Singles" && s.tour === "WTA")
      return {
        rank: qualSeed ? qualSeed.rank : null,
        name: qualSeed ? qualSeed.name : null
      }
    } else {
      const mainSeed = seeds.mainSeeds.find(s => s.seed === seed && s.type === "Singles" && s.tour === "WTA")
      return {
        rank: mainSeed ? mainSeed.rank : null,
        name: mainSeed ? mainSeed.name : null
      }
    }
  })
  const itfSingles = uniqueSeeds.map(seed => {
    if (typeof seed === "string") {
      const qualSeed = seeds.qualSeeds.find(s => `Q${s.seed}` === seed && s.type === "Singles" && (s.tour === "Men" || s.tour === "Women"))
      return {
        rank: qualSeed ? qualSeed.rank : null,
        name: qualSeed ? qualSeed.name : null
      }
    } else {
      const mainSeed = seeds.mainSeeds.find(s => s.seed === seed && s.type === "Singles" && (s.tour === "Men" || s.tour === "Women"))
      return {
        rank: mainSeed ? mainSeed.rank : null,
        name: mainSeed ? mainSeed.name : null
      }
    }
  })
  const atpDoubles = uniqueSeeds.map(seed => {
    if (typeof seed === "string") {
      const qualSeed = seeds.qualSeeds.filter(s => `Q${s.seed}` === seed && s.type === "Doubles" && s.tour === "ATP")
      return {
        rank: qualSeed.length ? qualSeed[0].rank! + qualSeed[1].rank! : null,
        name: qualSeed.length ? `${qualSeed[0].name} / ${qualSeed[1].name}` : null
      }
    } else {
      const mainSeed = seeds.mainSeeds.filter(s => s.seed === seed && s.type === "Doubles" && s.tour === "ATP")
      return {
        rank: mainSeed.length ? mainSeed[0].rank! + mainSeed[1].rank! : null,
        name: mainSeed.length ? `${mainSeed[0].name} / ${mainSeed[1].name}` : null
      }
    }
  })
  const wtaDoubles = uniqueSeeds.map(seed => {
    if (typeof seed === "string") {
      const qualSeed = seeds.qualSeeds.filter(s => `Q${s.seed}` === seed && s.type === "Doubles" && s.tour === "WTA")
      return {
        rank: qualSeed.length ? qualSeed[0].rank! + qualSeed[1].rank! : null,
        name: qualSeed.length ? `${qualSeed[0].name} / ${qualSeed[1].name}` : null
      }
    } else {
      const mainSeed = seeds.mainSeeds.filter(s => s.seed === seed && s.type === "Doubles" && s.tour === "WTA")
      return {
        rank: mainSeed.length ? mainSeed[0].rank! + mainSeed[1].rank! : null,
        name: mainSeed.length ? `${mainSeed[0].name} / ${mainSeed[1].name}` : null
      }
    }
  })
  const itfDoubles = uniqueSeeds.map(seed => {
    if (typeof seed === "string") {
      const qualSeed = seeds.qualSeeds.filter(s => `Q${s.seed}` === seed && s.type === "Doubles" && (s.tour === "Men" || s.tour === "Women"))
      return {
        rank: qualSeed.length ? qualSeed[0].rank! + qualSeed[1].rank! : null,
        name: qualSeed.length ? `${qualSeed[0].name} / ${qualSeed[1].name}` : null
      }
    } else {
      const mainSeed = seeds.mainSeeds.filter(s => s.seed === seed && s.type === "Doubles" && (s.tour === "Men" || s.tour === "Women"))
      return {
        rank: mainSeed.length ? mainSeed[0].rank! + mainSeed[1].rank! : null,
        name: mainSeed.length ? `${mainSeed[0].name} / ${mainSeed[1].name}` : null
      }
    }
  })
  return { atpSingles, wtaSingles, itfSingles, atpDoubles, wtaDoubles, itfDoubles }
})

const option = ref({
  backgroundColor: "transparent",
  textStyle: { color: colorMode.value === "dark" ? colours.darkText : colours.lightText },
  grid: { containLabel: true },
  tooltip: { trigger: "axis" },
  xAxis: {
    type: "category",
    data: uniqueSeeds
  },
  yAxis: { type: "value", name: "Rank", axisLabel: { interval: 5 } },
  series: [
    tours.includes("ATP") && {
      name: tours.includes("WTA") ? "ATP Singles" : "Singles",
      // label: {
      //   show: true,
      //   formatter: (params: any) => (params.value.rank === 0 ? "" : "Event"),
      //   rotate: 90
      // },
      type: "bar",
      encode: { x: "seed", y: "rank" },
      data: dataSet.value.atpSingles.map(s => s.rank),
      itemStyle: { color: colours.sky700 }
    },
    tours.includes("WTA") && {
      name: tours.includes("ATP") ? "WTA Singles" : "Singles",
      // label: {
      //   show: true,
      //   formatter: (params: any) => (params.value.rank === 0 ? "" : "Event"),
      //   rotate: 90
      // },
      type: "bar",
      encode: { x: "seed", y: "rank" },
      data: dataSet.value.wtaSingles.map(s => s.rank),
      itemStyle: { color: colours.fuchsia600 }
    },
    tours.includes("ITF") && {
      name: "Singles",
      // label: {
      //   show: true,
      //   formatter: (params: any) => (params.value.rank === 0 ? "" : "Event"),
      //   rotate: 90
      // },
      type: "bar",
      encode: { x: "seed", y: "rank" },
      data: dataSet.value.itfSingles.map(s => s.rank),
      itemStyle: { color: colours.cyan600 }
    },
    tours.includes("ATP") && {
      name: tours.includes("WTA") ? "ATP Doubles" : "Doubles",
      // label: {
      //   show: true,
      //   formatter: (params: any) => (params.value.rank === 0 ? "" : "Event"),
      //   rotate: 90
      // },
      type: "bar",
      encode: { x: "seed", y: "rank" },
      data: dataSet.value.atpDoubles.map(s => s.rank),
      itemStyle: { color: colours.indigo700 }
    },
    tours.includes("WTA") && {
      name: tours.includes("ATP") ? "WTA Doubles" : "Doubles",
      // label: {
      //   show: true,
      //   formatter: (params: any) => (params.value.rank === 0 ? "" : "Event"),
      //   rotate: 90
      // },
      type: "bar",
      encode: { x: "seed", y: "rank" },
      data: dataSet.value.wtaDoubles.map(s => s.rank),
      itemStyle: { color: colours.rose700 }
    },
    tours.includes("ITF") && {
      name: "Doubles",
      // label: {
      //   show: true,
      //   formatter: (params: any) => (params.value.rank === 0 ? "" : "Event"),
      //   rotate: 90
      // },
      type: "bar",
      encode: { x: "seed", y: "rank" },
      data: dataSet.value.itfDoubles.map(s => s.rank),
      itemStyle: { color: colours.pink600 }
    }
  ]
})
</script>

<template>
  <u-modal
    :title="`${name} ${year}`"
    description="Seeds"
    fullscreen
  >
    <u-button
      label="Chart view"
      :icon="icons.barChart"
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
