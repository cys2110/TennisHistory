<script setup lang="ts">
const appConfig = useAppConfig()
const route = useRoute()
const colorMode = useColorMode()
const toast = useToast()
const name = computed(() => decodeName(route.params.name as string))

interface APIResponse {
  country: string
  year: string
  player: string
}

// API call
const { data: countries } = await useFetch<APIResponse[]>("/api/tournaments/country-winners-chart", {
  query: { id: route.params.id },
  onResponseError: ({ error }) => {
    toast.add({
      title: `Error fetching country winners for ${name.value}`,
      description: error?.message,
      icon: appConfig.ui.icons.error,
      color: "error"
    })
  }
})

interface FormattedData {
  country: string
  players: string[]
  wins: number
  total_wins: number
  year: string
}

// Map data to get unique wins by players and cumulative wins by country
const formattedData = computed<FormattedData[]>(() => {
  if (!countries.value) return []

  const yearlyMap: Record<string, FormattedData> = {}
  const countryWinCount: Record<string, number> = {}
  const countryPlayerSet: Record<string, Set<string>> = {}

  const sorted = [...countries.value].sort((a, b) => a.year.localeCompare(b.year))

  for (const { country, year, player } of sorted) {
    const yearKey = `${country}-${year}`

    // Initialize the cumulative player set if needed
    if (!countryPlayerSet[country]) {
      countryPlayerSet[country] = new Set()
    }

    // Add player to the cumulative set
    countryPlayerSet[country].add(player)

    // Increment total win count (per match, not per player)
    countryWinCount[country] = (countryWinCount[country] ?? 0) + 1

    if (!yearlyMap[yearKey]) {
      yearlyMap[yearKey] = {
        country,
        year,
        players: [player],
        wins: countryPlayerSet[country].size, // cumulative unique players
        total_wins: countryWinCount[country]
      }
    } else {
      const entry = yearlyMap[yearKey]
      if (!entry.players.includes(player)) {
        entry.players.push(player)
      }

      entry.wins = countryPlayerSet[country].size // cumulative
      entry.total_wins = countryWinCount[country]
    }
  }

  return Object.values(yearlyMap)
})

// Get all years
const allYears = computed(() => [...new Set(formattedData.value.map(d => d.year))].sort())

// Get unique countries
const uniqueCountries = computed(() => [...new Set(formattedData.value.map(d => d.country))])

// Pad data to ensure all countries are represented for each year
const paddedData = computed(() => {
  const countryDataMap = new Map<string, FormattedData[]>()

  // Group original data by country
  for (const entry of formattedData.value) {
    if (!countryDataMap.has(entry.country)) {
      countryDataMap.set(entry.country, [])
    }
    countryDataMap.get(entry.country)!.push(entry)
  }

  const result: FormattedData[] = []

  for (const country of uniqueCountries.value) {
    const entries = countryDataMap.get(country) ?? []
    const byYear = Object.fromEntries(entries.map(e => [e.year, e]))

    let lastTotalWins = 0
    let lastWins = 0

    for (const year of allYears.value) {
      if (byYear[year]) {
        lastTotalWins = byYear[year].total_wins
        lastWins = byYear[year].wins
        result.push(byYear[year])
      } else {
        result.push({
          country,
          year,
          players: [],
          wins: lastWins,
          total_wins: lastTotalWins
        })
      }
    }
  }

  return result
})

const baseOption = {
  animationDuration: 10000,
  backgroundColor: "transparent",
  textStyle: {
    color: colorMode.value === "dark" ? COLOURS.darkText : COLOURS.lightText
  },
  tooltip: { trigger: "axis", order: "valueDesc" },
  legend: {
    textStyle: {
      color: colorMode.value === "dark" ? COLOURS.darkText : COLOURS.lightText
    }
  },
  xAxis: { type: "category", axisLine: { show: true } },
  yAxis: { type: "value", name: "Wins", splitLine: { show: false }, axisLine: { show: true } }
}
</script>

<template>
  <u-modal
    :title="name"
    description="Countries by No. of Winners"
    fullscreen
  >
    <u-button
      label="Chart view"
      :icon="ICONS.lineChart"
      size="xs"
    />

    <template #body>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-2">
        <country-unique-winners-chart
          v-if="countries"
          :countries="paddedData"
          :base-option="baseOption"
          :unique-countries="uniqueCountries"
        />
        <country-all-wins-chart
          v-if="countries"
          :countries="paddedData"
          :base-option="baseOption"
          :unique-countries="uniqueCountries"
        />
        <error-message
          v-else
          :icon="ICONS.noCountries"
          :message="`No countries by winners found for ${name}`"
        />
      </div>
    </template>
  </u-modal>
</template>
