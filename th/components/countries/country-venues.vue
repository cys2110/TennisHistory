<script setup lang="ts">
defineProps<{ name?: string }>()
const id = useRouteParams<string>("id")

// API call
const { data: venues, status } = await useFetch<VenueInterface[] | null>("/api/country-venues", { query: { id } })
</script>

<template>
  <dashboard-subpanel
    title="Venues"
    :icon="ICONS.venue"
  >
    <u-page-columns
      v-if="venues"
      class="xl:columns-3 2xl:columns-3"
    >
      <u-page-card
        v-for="venue in venues"
        :key="venue.id"
        :title="`${venue.name}, ${venue.city}`"
        :icon="`flag:${venue.country.alpha2}-4x3`"
      />
    </u-page-columns>
    <u-page-columns
      v-else-if="status === 'pending'"
      class="xl:columns-3 2xl:columns-3"
    >
      <base-loading-card
        v-for="_ in 6"
        :key="_"
      />
    </u-page-columns>
    <error-message
      v-else
      :title="`No venues located in ${name ?? id}`"
      :status
      :error="`Error fetching venues located in ${name ?? id}`"
    />
  </dashboard-subpanel>
</template>
