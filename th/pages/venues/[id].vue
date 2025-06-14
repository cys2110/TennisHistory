<script setup lang="ts">
import { TournamentCalendarGrid, TournamentCalendarTable } from "#components"

definePageMeta({ name: "venue" })
const { viewMode } = useViewMode()
const { params } = useRoute()
const name = computed(() => decodeName(params.id as string))

// API call
const { data, status } = await useFetch<APIVenueResponseType>("/api/venues/details", {
  query: { id: name },
  default: () => ({ events: [], name: "", city: "" })
})

useHead({ title: () => `${data.value?.name} | ${data.value?.city}`, templateParams: { subPage: "Venues" } })
</script>

<template>
  <page-wrapper>
    <component
      :is="viewMode === 'list' ? TournamentCalendarTable : TournamentCalendarGrid"
      :key="viewMode"
      :events="data.events"
      :status
      :value="data.name ? `${data.name}, ${data.city}` : (data.city ?? name)"
    />
  </page-wrapper>
</template>
