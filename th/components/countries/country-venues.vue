<script setup lang="ts">
defineProps<{ name?: string }>()
const id = useRouteParams<string>("id")
const route = useRoute()
const toast = useToast()

// API call
const {
  data: venues,
  status,
  refresh
} = await useFetch<VenueInterface[] | null>("/api/country-venues", {
  query: { id },
  watch: false,
  onResponseError: ({ error }) => {
    toast.add({
      title: `Error fetching venues located in ${name ?? id}`,
      description: error?.message,
      icon: ICONS.error,
      color: "error"
    })
  }
})

watch(
  () => id.value,
  newId => {
    if (newId && newId !== " " && route.name === "country") refresh()
  }
)
</script>

<template>
  <dashboard-subpanel
    title="Venues"
    :icon="ICONS.venue"
  >
    <u-page-columns
      v-if="venues?.length"
      class="xl:columns-2 2xl:columns-3"
    >
      <u-page-card
        v-for="venue in venues"
        :key="venue.id"
        :title="`${venue.name}, ${venue.city}`"
        :icon="venue.country.alpha2 ? `flag:${venue.country.alpha2}-4x3` : `flags:${venue.country.id}`"
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
