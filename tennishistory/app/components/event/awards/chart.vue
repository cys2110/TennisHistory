<script setup lang="ts">
const { awards } = defineProps<{ awards: RoundInterface[] }>()
const {
  params: { year }
} = useRoute()
const { icons, colours } = useAppConfig()
const colorMode = useColorMode()
const tours = inject<TourType[]>("tours", [])
const tournament = inject<TournamentInterface>("tournament")

const option = computed(() => ({
  backgroundColor: "transparent",
  textStyle: { color: colorMode.value === "dark" ? colours.darkText : colours.lightText },
  grid: { containLabel: true },
  tooltip: {
    trigger: "item",
    formatter: (params: any) => {
      return `
          <div class="font-bold flex justify-between items-center">
          <span>${params.value.round}</span>
          <span>${params.value.tour.replace("ITF (M)", "Men").replace("ITF (W)", "Women")} | ${params.value.type}</span>
          </div>
          <div class="flex justify-between items-center">
            <span>Points:</span>
            <span>${params.value.points}</span>
          </div>
          <div class="flex justify-between items-center gap-3">
            <span>Prize Money:</span>
            <span>${params.value.currency ? params.value.pm.toLocaleString("en-GB", { style: "currency", currency: params.value.currency }) : ""}</span>
          </div>
      `
    }
  },
  dataset: {
    source: awards,
    dimensions: ["round", "points", "pm", "currency", "tour", "type"]
  },
  xAxis: {
    type: "value",
    name: "Points",
    splitLine: { show: false },
    axisLabel: { formatter: (value: number) => value.toLocaleString("en-GB") }
  },
  yAxis: {
    type: "value",
    name: "Prize Money",
    axisLabel: {
      formatter: (value: number) => value.toLocaleString("en-GB", { style: "currency", currency: awards[0]?.currency ?? "USD" })
    },
    splitLine: { show: false }
  },
  series: [
    {
      symbolSize: 20,
      type: "scatter",
      encode: { x: "points", y: "pm" },
      itemStyle: {
        color: (params: any) => {
          switch (params.value.tour) {
            case "ATP":
            case "Men":
              if (params.value.type === "Singles") {
                return colorMode.value === "dark" ? colours.sky300 : colours.sky700
              }
              return colorMode.value === "dark" ? colours.indigo300 : colours.indigo700
            default:
              if (params.value.type === "Singles") {
                return colorMode.value === "dark" ? colours.fuchsia300 : colours.fuchsia600
              }
              return colorMode.value === "dark" ? colours.red300 : colours.red700
          }
        }
      }
    }
  ]
}))
</script>

<template>
  <u-modal
    :title="`${tournament?.name} ${year}`"
    description="Awards"
    fullscreen
  >
    <u-button
      label="Chart"
      :icon="icons.scatterChart"
    />

    <template #body>
      <div class="w-full flex justify-evenly gap-5">
        <div
          v-if="tours.includes('ATP') || tours.includes('Men')"
          class="flex items-center gap-2"
        >
          <u-icon
            :name="icons.colours"
            :class="colorMode.value === 'dark' ? 'text-sky-300' : 'text-sky-700'"
            class="text-xl"
          />
          <span>{{ tours.includes("ATP") ? "ATP" : "ITF (M)" }} Singles</span>
        </div>

        <div
          v-if="tours.includes('ATP') || tours.includes('Men')"
          class="flex items-center gap-2"
        >
          <u-icon
            :name="icons.colours"
            :class="colorMode.value === 'dark' ? 'text-indigo-300' : 'text-indigo-700'"
            class="text-xl"
          />
          <span>{{ tours.includes("ATP") ? "ATP" : "ITF (M)" }} Doubles</span>
        </div>

        <div
          v-if="tours.includes('WTA') || tours.includes('Women')"
          class="flex items-center gap-2"
        >
          <u-icon
            :name="icons.colours"
            :class="colorMode.value === 'dark' ? 'text-fuchsia-300' : 'text-fuchsia-600'"
            class="text-xl"
          />
          <span>{{ tours.includes("WTA") ? "WTA" : "ITF (W)" }} Singles</span>
        </div>

        <div
          v-if="tours.includes('WTA') || tours.includes('WTA')"
          class="flex items-center gap-2"
        >
          <u-icon
            :name="icons.colours"
            :class="colorMode.value === 'dark' ? 'text-red-300' : 'text-red-700'"
            class="text-xl"
          />
          <span>{{ tours.includes("WTA") ? "WTA" : "ITF (W)" }} Doubles</span>
        </div>
      </div>
      <v-chart
        class="min-h-50 w-full"
        :option
        :autoresize="true"
      />
    </template>
  </u-modal>
</template>
