<script setup lang="ts">
interface FormattedData {
  country: string
  players: string[]
  wins: number
  total_wins: number
  year: string
}
const { countries, baseOption, uniqueCountries } = defineProps<{ countries: FormattedData[]; baseOption: any; uniqueCountries: string[] }>()
const option = computed(() => {
  return {
    ...baseOption,
    dataset: [
      {
        id: "base",
        source: countries,
        dimensions: ["year", "country", "wins", "total_wins"]
      },
      ...uniqueCountries.map((country, i) => ({
        id: `country-${i}`,
        fromDatasetId: "base",
        transform: {
          type: "filter",
          config: { dimension: "country", value: country }
        }
      }))
    ],
    series: [
      ...uniqueCountries.map((country, i) => ({
        type: "line",
        name: country,
        smooth: true,
        datasetId: `country-${i}`,
        encode: { x: "year", y: "total_wins" }
      }))
    ]
  }
})
</script>

<template>
  <div class="mt-10 font-bold text-lg">Countries by Total Wins</div>
  <v-chart
    class="min-h-150 w-full my-auto mt-10"
    :option
    :autoresize="true"
  />
</template>
