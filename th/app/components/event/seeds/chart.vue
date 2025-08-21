<script setup lang="ts">
const { seeds } = defineProps<{
  seeds: SeedInterface[]
}>()
const { year } = useRoute().params as { year: string }
const { icons, colours } = useAppConfig()
const colorMode = useColorMode()
const tours = inject<TourType[]>("tours", [])
const tournament = inject<TournamentInterface>("tournament")

const option = computed(() => ({
  backgroundColor: "transparent",
  textStyle: { color: colorMode.value === "dark" ? colours.darkText : colours.lightText },
  grid: { containLabel: true },
  tooltip: {
    trigger: "axis",
    formatter: (params: any) => {
      const seed = `<div class="font-bold">${params[0].value.seed}</div>`
      const players = (team: any[]) => {
        return team
          .map((t: any) => {
            return `<div>${t.first_name} ${t.last_name}</div>`
          })
          .join("")
      }
      const seeds = params.map((p: any) => {
        return `<div class="flex justify-between items-start text-xs gap-5">
        <div class="flex items-center gap-2">
          ${p.marker}
            <span>${p.value.rank2}</span>
            <span>${p.value.tour} | ${p.value.type} | ${p.value.draw}</span>
        </div>
        <div class="flex flex-col">
        ${players(p.value.team)}
        </div>
          </div>`
      })
      return seed + seeds.join("")
    }
  },
  dataset: {
    source: seeds,
    dimensions: ["tour", "type", "draw", "seed", "rank2", "team"]
  },
  xAxis: {
    type: "value",
    name: "Seeds",
    splitLine: { show: false }
  },
  yAxis: {
    type: "value",
    name: "Rank at draw",
    splitLine: { show: false }
  },
  series: [
    {
      symbolSize: 20,
      type: "scatter",
      encode: { x: "seed", y: "rank2" },
      itemStyle: {
        color: (params: any) => {
          switch (params.value.tour) {
            case "ATP":
            case "Men":
              switch (params.value.type) {
                case "Singles":
                  switch (params.value.draw) {
                    case "Main":
                      return colorMode.value === "dark" ? colours.sky300 : colours.sky700
                    default:
                      return colorMode.value === "dark" ? colours.indigo300 : colours.indigo700
                  }
                default:
                  switch (params.value.draw) {
                    case "Main":
                      return colorMode.value === "dark" ? colours.lime300 : colours.lime500
                    default:
                      return colorMode.value === "dark" ? colours.emerald300 : colours.emerald700
                  }
              }
            default:
              switch (params.value.type) {
                case "Singles":
                  switch (params.value.draw) {
                    case "Main":
                      return colorMode.value === "dark" ? colours.fuchsia300 : colours.fuchsia600
                    default:
                      return colorMode.value === "dark" ? colours.red300 : colours.red700
                  }
                default:
                  switch (params.value.draw) {
                    case "Main":
                      return colorMode.value === "dark" ? colours.yellow300 : colours.yellow600
                    default:
                      return colorMode.value === "dark" ? colours.orange300 : colours.orange600
                  }
              }
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
    description="Seeds"
    fullscreen
  >
    <u-button
      label="Chart"
      :icon="icons.barChart"
    />

    <template #body>
      <div class="w-full flex flex-wrap justify-evenly gap-5 text-sm">
        <div
          v-if="tours.includes('ATP') || tours.includes('Men')"
          class="flex items-center gap-2"
        >
          <u-icon
            :name="icons.colours"
            :class="colorMode.value === 'dark' ? 'text-sky-300' : 'text-sky-700'"
            class="text-xl"
          />
          <span>{{ tours.includes("ATP") ? "ATP" : "ITF (M)" }} Singles Main</span>
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
          <span>{{ tours.includes("ATP") ? "ATP" : "ITF (M)" }} Singles Qualifying</span>
        </div>

        <div
          v-if="tours.includes('ATP') || tours.includes('Men')"
          class="flex items-center gap-2"
        >
          <u-icon
            :name="icons.colours"
            :class="colorMode.value === 'dark' ? 'text-lime-300' : 'text-lime-500'"
            class="text-xl"
          />
          <span>{{ tours.includes("ATP") ? "ATP" : "ITF (M)" }} Doubles Main</span>
        </div>

        <div
          v-if="tours.includes('ATP') || tours.includes('Men')"
          class="flex items-center gap-2"
        >
          <u-icon
            :name="icons.colours"
            :class="colorMode.value === 'dark' ? 'text-emerald-300' : 'text-emerald-700'"
            class="text-xl"
          />
          <span>{{ tours.includes("ATP") ? "ATP" : "ITF (M)" }} Doubles Qualifying</span>
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
          <span>{{ tours.includes("WTA") ? "WTA" : "ITF (W)" }} Singles Main</span>
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
          <span>{{ tours.includes("WTA") ? "WTA" : "ITF (W)" }} Singles Qualifying</span>
        </div>

        <div
          v-if="tours.includes('WTA') || tours.includes('WTA')"
          class="flex items-center gap-2"
        >
          <u-icon
            :name="icons.colours"
            :class="colorMode.value === 'dark' ? 'text-yellow-300' : 'text-yellow-600'"
            class="text-xl"
          />
          <span>{{ tours.includes("WTA") ? "WTA" : "ITF (W)" }} Doubles Main</span>
        </div>

        <div
          v-if="tours.includes('WTA') || tours.includes('WTA')"
          class="flex items-center gap-2"
        >
          <u-icon
            :name="icons.colours"
            :class="colorMode.value === 'dark' ? 'text-orange-300' : 'text-orange-600'"
            class="text-xl"
          />
          <span>{{ tours.includes("WTA") ? "WTA" : "ITF (W)" }} Doubles Qualifying</span>
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
