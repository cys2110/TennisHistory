<script setup lang="ts">
const { index } = defineProps<{ index: WLIndexInterface[] }>()
const { icons, colours } = useAppConfig()
const route = useRoute()
const colorMode = useColorMode()
const name = computed(() => decodeName(route.params.name as string))

const option = ref({
  backgroundColor: "transparent",
  textStyle: { color: colorMode.value === "dark" ? colours.darkText : colours.lightText },
  grid: { containLabel: true },
  tooltip: {
    trigger: "axis",
    textStyle: { fontWeight: "bold" }
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
      name: "Tour Main",
      type: "bar",
      encode: { x: "value", y: "stat" },
      data: index.filter(i => i.level === "Tour" && i.type === "Main").map(i => Number(i.value))
    },
    {
      name: "Tour Qualifying",
      type: "bar",
      encode: { x: "value", y: "stat" },
      data: index.filter(i => i.level === "Tour" && i.type === "Qualifying").map(i => Number(i.value))
    },
    {
      name: "Challenger Main",
      type: "bar",
      encode: { x: "value", y: "stat" },
      data: index.filter(i => i.level === "Challenger" && i.type === "Main").map(i => Number(i.value))
    },
    {
      name: "Challenger Qualifying",
      type: "bar",
      encode: { x: "value", y: "stat" },
      data: index.filter(i => i.level === "Challenger" && i.type === "Qualifying").map(i => Number(i.value))
    },
    {
      name: "ITF Main",
      type: "bar",
      encode: { x: "value", y: "stat" },
      // itemStyle: {
      //   color: function (param: any) {
      //     return categoryColours[param.data.category as keyof typeof categoryColours]
      //   }
      // },
      data: index.filter(i => i.level === "ITF" && i.type === "Main").map(i => Number(i.value))
    },
    {
      name: "ITF Qualifying",
      type: "bar",
      encode: { x: "value", y: "stat" },
      // itemStyle: {
      //   color: function (param: any) {
      //     return categoryColours[param.data.category as keyof typeof categoryColours]
      //   }
      // },
      data: index.filter(i => i.level === "ITF" && i.type === "Qualifying").map(i => Number(i.value))
    },
    {
      name: "Tour Titles",
      type: "scatter",
      encode: { x: "titles", y: "stat" },
      xAxisIndex: 1,
      data: index.filter(i => i.level === "Tour" && i.type === "Main").map(i => i.titles)
    },
    {
      name: "Challenger Titles",
      type: "scatter",
      encode: { x: "titles", y: "stat" },
      xAxisIndex: 1,
      data: index.filter(i => i.level === "Challenger" && i.type === "Main").map(i => i.titles)
    },
    {
      name: "ITF Titles",
      type: "scatter",
      encode: { x: "titles", y: "stat" },
      xAxisIndex: 1,
      data: index.filter(i => i.level === "ITF" && i.type === "Main").map(i => i.titles)
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
