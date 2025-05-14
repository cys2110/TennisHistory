<script setup lang="ts">
const { stats, p1, p2 } = defineProps<{
  category: string
  stats: { category: string; label: string; p1: string; p1_pc: number; p2: string; p2_pc: number }[]
  p1: Pick<PlayerInterface, "name" | "id" | "country">
  p2: Pick<PlayerInterface, "name" | "id" | "country">
}>()
const route = useRoute()
const colorMode = useColorMode()

const option = ref({
  backgroundColor: "transparent",
  grid: { containLabel: true },
  textStyle: { color: colorMode.value === "dark" ? COLOURS.darkText : COLOURS.lightText },
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
              ${p1.name}
            </div>
            <div class='font-semibold'>${params[0].data.p1} (${params[0].data.p1_pc}%)</div>
          </div>
          <div class="flex justify-between gap-5">
            <div class="flex items-center font-bold">
              ${params[1].marker}
              ${p2.name}
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
      name: p1.name,
      type: "bar",
      encode: { x: "p1_pc", y: "label" },
      itemStyle: { color: COLOURS.violet700 },
      label: {
        show: true,
        color: colorMode.value === "dark" ? COLOURS.darkText : COLOURS.lightText,
        formatter: "{a}"
      }
    },
    {
      name: p2.name,
      type: "bar",
      encode: { x: "p2_pc", y: "label" },
      itemStyle: { color: COLOURS.emerald700 },
      label: {
        show: true,
        color: colorMode.value === "dark" ? COLOURS.darkText : COLOURS.lightText,
        formatter: "{a}"
      }
    }
  ]
})
</script>

<template>
  <u-modal
    :title="`${route.params.name} ${route.params.year}`"
    :description="category"
    fullscreen
  >
    <u-button
      label="Chart view"
      :icon="ICONS.barChart"
      size="xs"
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
