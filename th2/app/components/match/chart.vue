<script setup lang="ts">
const {
  stats,
  p1,
  p2,
  label = "Chart"
} = defineProps<{
  category: string
  label?: string
  stats: MatchStatsType[]
  p1: PlayerInterface[]
  p2: PlayerInterface[]
}>()
const { colours, icons } = useAppConfig()
const colorMode = useColorMode()
const { params } = useRoute()
const { year } = params as { year?: string }

const tournament = inject<string>("tournament", "")

const option = ref({
  backgroundColor: "transparent",
  grid: { containLabel: true },
  textStyle: { color: colorMode.value === "dark" ? colours.darkText : colours.lightText },
  dataset: {
    source: stats,
    dimensions: ["label", "p1", "p1_pc", "p2", "p2_pc"]
  },
  tooltip: {
    trigger: "axis",
    formatter: (params: any) => {
      return `
        <div class="flex flex-col gap-2">
          <div class="flex justify-between gap-5">
            <div class="flex items-center font-bold">
              ${params[0].marker}
              ${p1.map(player => `${player.first_name} ${player.last_name}`).join(" | ")}
            </div>
            <div class='font-semibold'>${params[0].data.p1} (${params[0].data.p1_pc}%)</div>
          </div>
          <div class="flex justify-between gap-5">
            <div class="flex items-center font-bold">
              ${params[1].marker}
              ${p2.map(player => `${player.first_name} ${player.last_name}`).join(" | ")}
            </div>
            <div class='font-semibold'>${params[1].data.p2} (${params[1].data.p2_pc}%)</div>
          </div>
        </div>
      `
    }
  },
  xAxis: { type: "value", max: 100, axisLabel: { formatter: "{value}%" } },
  yAxis: { type: "category", inverse: true },
  series: [
    {
      name: p1.map(player => `${player.first_name} ${player.last_name}`).join(" | "),
      type: "bar",
      encode: { x: "p1_pc", y: "label" },
      itemStyle: { color: colours.indigo700 },
      label: {
        show: true,
        color: colorMode.value === "dark" ? colours.darkText : colours.lightText,
        formatter: "{a}"
      }
    },
    {
      name: p2.map(player => `${player.first_name} ${player.last_name}`).join(" | "),
      type: "bar",
      encode: { x: "p2_pc", y: "label" },
      itemStyle: { color: colours.fuchsia600 },
      label: {
        show: true,
        color: colorMode.value === "dark" ? colours.darkText : colours.lightText,
        formatter: "{a}"
      }
    }
  ]
})

const getButtonColour = (category: string) => {
  switch (category) {
    case "Service Stats":
      return "men"
    case "Return Stats":
      return "women"
    case "Points Stats":
      return "joint"
    case "Service Speed":
      return "active"
    default:
      return "neutral"
  }
}
</script>

<template>
  <u-modal
    :title="`${tournament} ${year}`"
    :description="category"
    fullscreen
  >
    <u-button
      :label
      :icon="icons.barChart"
      block
      :color="getButtonColour(category)"
    />

    <template #body>
      <v-chart
        class="h-200 w-full"
        :option="option"
        :autoresize="true"
      />
    </template>
  </u-modal>
</template>
