<script setup lang="ts">
import { CountryVenuesGrid, CountryVenuesTable } from "#components"

defineProps<{ name?: string }>()
const appConfig = useAppConfig()
const route = useRoute()
const toast = useToast()
const { viewMode } = useViewMode()

const skip = ref(0)
const sort = ref<"ASC" | "DESC">("ASC")
const venues = ref<VenueInterface[]>([])

interface APIResponseType {
  count: number
  venues: VenueInterface[]
}

// API call
const { data, status, execute } = await useFetch<APIResponseType>("/api/countries/venues", {
  query: { id: route.params.id, skip, sort },
  default: () => ({ count: 0, venues: [] }),
  lazy: true,
  immediate: false,
  onResponse: ({ response }) => (venues.value = [...venues.value, ...(response._data.venues || [])]),
  onResponseError: ({ error }) => {
    toast.add({
      title: `Error fetching venues located in ${name ?? route.params.id}`,
      description: error?.message,
      icon: appConfig.ui.icons.error,
      color: "error"
    })
    showError(error!)
  }
})

execute()

watch(sort, () => {
  skip.value = 0
  venues.value = []
})
</script>

<template>
  <dashboard-subpanel
    title="Venues"
    :icon="ICONS.venue"
  >
    <component
      :is="viewMode === 'cards' ? CountryVenuesGrid : CountryVenuesTable"
      :key="viewMode"
      v-model="skip"
      v-model:sort="sort"
      :venues
      :status
      :count="data?.count ?? 0"
      :name
    />
  </dashboard-subpanel>
</template>
