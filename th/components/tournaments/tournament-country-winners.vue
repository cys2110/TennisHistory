<script setup lang="ts">
import { TournamentCountryWinnersGrid, TournamentCountryWinnersTable } from "#components"

const appConfig = useAppConfig()
const route = useRoute()
const toast = useToast()
const { viewMode } = useViewMode()
const name = computed(() => decodeName(route.params.name as string))

interface APIResponse {
  wins: string
  country: CountryInterface
  total_wins: string
}

// API call
const { data: countries, status } = await useFetch<APIResponse[]>("/api/tournaments/country-winners", {
  query: { id: route.params.id },
  default: () => [],
  onResponseError: ({ error }) => {
    toast.add({
      title: `Error fetching winners by country for ${name.value}`,
      description: error?.message,
      icon: appConfig.ui.icons.error,
      color: "error"
    })
    showError(error!)
  }
})
</script>

<template>
  <dashboard-subpanel
    title="Countries by No. of Winners"
    :icon="ICONS.countries"
  >
    <template #right>
      <tournament-country-winners-chart />
    </template>

    <component
      :is="viewMode === 'cards' ? TournamentCountryWinnersGrid : TournamentCountryWinnersTable"
      :key="viewMode"
      :countries
      :status
    />
  </dashboard-subpanel>
</template>
