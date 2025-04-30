<script setup lang="ts">
defineProps<{ name?: string }>()
const id = useRouteParams<string>("id")
const appConfig = useAppConfig()
const route = useRoute()
const toast = useToast()

// API call
const {
  data: venues,
  status,
  refresh
} = await useFetch<VenueInterface[] | null>("/api/countries/venues", {
  query: { id },
  watch: false,
  onResponseError: ({ error }) => {
    toast.add({
      title: `Error fetching venues located in ${name ?? id}`,
      description: error?.message,
      icon: appConfig.ui.icons.error,
      color: "error"
    })
    showError(error!)
  }
})

watch(
  () => id.value,
  newId => {
    if (newId && route.name === "country") refresh()
  },
  { immediate: true }
)
</script>

<template>
  <dashboard-subpanel
    title="Venues"
    :icon="ICONS.venue"
  >
    <u-page-columns
      v-if="venues?.length || ['pending', 'idle'].includes(status)"
      class="xl:columns-2 2xl:columns-3"
    >
      <u-page-card
        v-if="venues"
        v-for="venue in venues"
        :key="venue.id"
        :title="venue.name ? `${venue.name}, ${venue.city}` : venue.city"
        :icon="
          venue.country.alpha2 ? `flag:${venue.country.alpha2}-4x3` : `flags:${venue.country.id}`
        "
        :to="{ name: 'venue', params: { id: encodeName(venue.id) } }"
      />
      <base-loading-card
        v-else
        v-for="_ in 6"
        :key="_"
      />
    </u-page-columns>

    <error-message
      v-else
      :title="`No venues located in ${name ?? id}`"
    />
  </dashboard-subpanel>
</template>
