<script setup lang="ts">
const { index } = defineProps<{ index: WLIndexInterface[] }>()
const route = useRoute()
const colorMode = useColorMode()
const name = computed(() => decodeName(route.params.name as string))

const categoryColours = {
  "Match Record": COLOURS.sky700,
  "Pressure Points": COLOURS.fuchsia600,
  Environment: COLOURS.violet700,
  Other: COLOURS.emerald700
}

const legendColors = {
  "Match Record": "text-sky-700",
  "Pressure Points": "text-fuchsia-600",
  Environment: "text-violet-700",
  Other: "text-emerald-700"
}

const option = ref({
  backgroundColor: "transparent",
  textStyle: { color: colorMode.value === "dark" ? COLOURS.darkText : COLOURS.lightText },
  grid: { containLabel: true },
  tooltip: {
    trigger: "axis",
    textStyle: { fontWeight: "bold" }
  },
  dataset: {
    source: index,
    dimensions: ["category", "stat", "win", "loss", "titles", "value"]
  },
  xAxis: [
    {
      type: "value",
      name: "Index",
      max: 1,
      splitLine: {
        lineStyle: { color: colorMode.value === "dark" ? COLOURS.lightText : COLOURS.darkText }
      }
    },
    { type: "value", name: "Titles", splitLine: { show: false } }
  ],
  yAxis: { type: "category", inverse: true },
  series: [
    {
      name: "Index",
      type: "bar",
      encode: { x: "value", y: "stat" },
      itemStyle: {
        color: function (param: any) {
          return categoryColours[param.data.category as keyof typeof categoryColours]
        }
      }
    },
    {
      name: "Titles",
      type: "scatter",
      encode: { x: "titles", y: "stat" },
      xAxisIndex: 1,
      itemStyle: { color: COLOURS.orange600 }
    }
  ]
})
</script>

<template>
  <u-modal
    :title="name"
    description="Win-Loss Index"
    fullscreen
  >
    <u-button
      label="Chart view"
      :icon="ICONS.barChart"
      size="sm"
    />

    <template #body>
      <div class="flex justify-between">
        <div
          v-for="(entry, index) in Object.entries(legendColors)"
          :key="index"
          class="mx-5 flex items-center gap-2"
        >
          <u-icon
            name="zondicons:color-palette"
            :class="entry[1]"
          />
          <div class="text-(--ui-text-muted) self-center text-xs lg:text-sm">{{ entry[0] }}</div>
        </div>
      </div>
      <v-chart
        class="min-h-200 w-full"
        :option
        :autoresize="true"
      />
    </template>
  </u-modal>
</template>
