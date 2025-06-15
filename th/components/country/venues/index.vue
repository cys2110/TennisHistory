<script setup lang="ts">
import { CountryVenuesGrid, CountryVenuesTable } from "#components"

const { icons } = useAppConfig()
const { params } = useRoute()
const { viewMode } = useViewMode()

// API call
const { data: venues, status } = await useFetch<VenueInterface[]>("/api/countries/venues", {
  query: { id: params.id },
  default: () => []
})
</script>

<template>
  <dashboard-subpanel
    id="venues"
    title="Venues"
    :icon="icons.venue"
  >
    <component
      :is="viewMode === 'list' ? CountryVenuesTable : CountryVenuesGrid"
      :key="viewMode"
      :venues
      :status
    />
  </dashboard-subpanel>
</template>
