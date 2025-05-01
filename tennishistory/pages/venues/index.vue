<script setup lang="ts">
useHead({ title: "Venues", templateParams: { subPage: null } })
const appConfig = useAppConfig()
const toast = useToast()

// Breadcrumbs
const breadcrumbs = [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Venues", icon: ICONS.venue }
]

const selectedLetter = ref<string>("All")
const page = ref(1)
const pageSize = ref(25)

interface VenuesAPIResponse {
  count: number
  cities: {
    city: string
    country: CountryInterface
    venues: Pick<VenueInterface, "id" | "name">[]
  }[]
}

// API call
const { data, status } = await useFetch<VenuesAPIResponse>("/api/venues", {
  query: {
    letter: selectedLetter,
    skip: computed(() => (page.value - 1) * pageSize.value),
    limit: pageSize
  },
  default: () => ({ count: 0, cities: [] }),
  onResponseError: ({ error }) => {
    toast.add({
      title: "Error fetching venues",
      description: error?.message,
      icon: appConfig.ui.icons.error,
      color: "error"
    })
    showError(error!)
  }
})
</script>

<template>
  <paginated-overview
    :breadcrumbs
    v-model="selectedLetter"
    v-model:page="page"
    v-model:page-size="pageSize"
    :count="data.count"
  >
    <u-page-grid
      v-if="data.count || ['pending', 'idle'].includes(status)"
      class="mt-10"
    >
      <venue-card
        v-if="data.count"
        v-for="city in data.cities"
        :key="city.city"
        :city
      />

      <base-loading-card
        v-else
        v-for="_ in 15"
        :key="_"
      />
    </u-page-grid>

    <error-message
      v-else
      title="No venues found"
    />
  </paginated-overview>
</template>
