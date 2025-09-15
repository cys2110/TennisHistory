<script setup lang="ts">
const { awards } = defineProps<{ awards: RoundInterface[] }>()
const {
  params: { year }
} = useRoute("event")
const { icons, colours } = useAppConfig()
const colorMode = useColorMode()
const tours = useState<TourType[]>("tours")
const tournamentName = useState<string>("tournament-name")

const currencies = computed(() => {
  const uniqueCurrencies = [...new Set(awards.map(award => award.currency).filter(currency => currency))]
  return uniqueCurrencies.map(currency => CURRENCIES[currency]).join(" / ")
})

const option = computed(() => ({
  backgroundColor: "transparent",
  textStyle: { color: colorMode.value === "dark" ? colours.darkText : colours.lightText },
  grid: { containLabel: true },
  dataset: [
    {
      source: awards,
      dimensions: ["round", "points", "pm", "currency", "tour", "type"]
    },
    ...tours.value.map(tour => ({
      transform: {
        type: "filter",
        config: {
          and: [
            { dimension: "type", value: "Singles" },
            { dimension: "tour", value: tour }
          ]
        }
      }
    })),
    ...tours.value.map(tour => ({
      transform: {
        type: "filter",
        config: {
          and: [
            { dimension: "type", value: "Doubles" },
            { dimension: "tour", value: tour }
          ]
        }
      }
    }))
  ],
  tooltip: {
    trigger: "axis"
  },
  legend: {
    textStyle: { color: colorMode.value === "dark" ? colours.darkText : colours.lightText },
    top: "middle",
    right: "right"
  },
  xAxis: {
    type: "category",
    inverse: true,
    axisLabel: { color: colorMode.value === "dark" ? colours.darkText : colours.lightText }
  },
  yAxis: [
    {
      type: "value",
      name: `Prize Money (${currencies.value})`,
      axisLabel: { color: colorMode.value === "dark" ? colours.darkText : colours.lightText }
    },
    {
      type: "value",
      name: "Points",
      splitLine: { show: false },
      axisLabel: {
        formatter: (value: number) => value.toLocaleString("en-GB"),
        color: colorMode.value === "dark" ? colours.darkText : colours.lightText
      }
    }
  ],
  series: [
    ...tours.value.map((tour, index) => ({
      name: `${tour} Singles PM`,
      type: "line",
      encode: { x: "round", y: "pm" },
      yAxisIndex: 0,
      datasetIndex: index + 1,
      tooltip: {
        valueFormatter: (value: number) => {
          const currency = awards.find(award => award.tour === tour)?.currency
          return currency ? value.toLocaleString("en-GB", { style: "currency", currency }) : value
        }
      }
    })),
    ...tours.value.map((tour, index) => ({
      name: `${tour} Doubles PM`,
      type: "line",
      encode: { x: "round", y: "pm" },
      yAxisIndex: 0,
      datasetIndex: index + tours.value.length + 1,
      tooltip: {
        valueFormatter: (value: number) => {
          const currency = awards.find(award => award.tour === tour)?.currency
          return currency ? value.toLocaleString("en-GB", { style: "currency", currency }) : value
        }
      }
    })),
    ...tours.value.map((tour, index) => ({
      name: `${tour} Singles Points`,
      type: "scatter",
      encode: { x: "round", y: "points" },
      yAxisIndex: 1,
      datasetIndex: index + 1,
      symbol: "diamond"
    })),
    ...tours.value.map((tour, index) => ({
      name: `${tour} Doubles Points`,
      type: "scatter",
      encode: { x: "round", y: "points" },
      yAxisIndex: 1,
      datasetIndex: index + tours.value.length + 1,
      symbol: "diamond"
    }))
  ]
}))
</script>

<template>
  <u-modal
    :title="`${tournamentName} ${year}`"
    description="Awards"
    fullscreen
  >
    <u-button
      label="Chart"
      :icon="icons.scatterChart"
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
