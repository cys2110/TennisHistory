<script setup lang="ts">
const id = useRouteParams<string>("id")
const paramName = useRouteParams<string>("name")
const name = computed(() => decodeName(paramName.value))
const toast = useToast()
const colorMode = useColorMode()

interface APIResponse {
  country: string
  year: string
  player: string
}

// API call
const { data: countries, status } = await useFetch<APIResponse[]>("/api/tournament-country-winners-chart", {
  query: { id },
  onResponseError: () => {
    toast.add({
      title: `Error fetching winners by country for ${name.value}`,
      icon: ICONS.error,
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
    color: colorMode.value === "dark" ? CHART_COLOURS.darkText : CHART_COLOURS.lightText
  },
  tooltip: { trigger: "axis", order: "valueDesc" },
  legend: {
    textStyle: {
      color: colorMode.value === "dark" ? CHART_COLOURS.darkText : CHART_COLOURS.lightText
    }
  },
  xAxis: { type: "category", axisLine: { show: true } },
  yAxis: { type: "value", name: "Wins", splitLine: { show: false }, axisLine: { show: true } }
}
</script>

<template>
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
    :status
    :title="`No winners by country found for ${name}`"
  />
</template>
