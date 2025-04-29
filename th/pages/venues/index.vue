<script setup lang="ts">
definePageMeta({ name: "venues" })
useHead({ title: "Venues", templateParams: { subPage: null } })
const toast = useToast()

interface VenuesAPIResponse {
  count: number
  cities: { city: string; country: CountryInterface; venues: VenueInterface[] }[]
}

const selectedLetter = ref<string>("All")
const page = ref(1)
const pageSize = ref(25)

// API call
const { data, status } = await useFetch<VenuesAPIResponse>("/api/all-venues", {
  query: { letter: selectedLetter, skip: computed(() => (page.value - 1) * pageSize.value), limit: pageSize },
  onResponseError: ({ error }) => {
    toast.add({
      title: "Error fetching venues",
      description: error?.message,
      icon: ICONS.error,
      color: "error"
    })
  }
})

// Breadcrumbs
const breadcrumbs = [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Venues", icon: ICONS.venue }
]
</script>

<template>
  <paginated-overview
    :breadcrumbs
    v-model="selectedLetter"
    v-model:page="page"
    v-model:page-size="pageSize"
    :count="data?.count"
  >
    <u-page-grid
      v-if="data && data.count > 0"
      class="mt-10"
    >
      <venue-card
        v-for="city in data.cities"
        :key="city.city"
        :city
      />
    </u-page-grid>

    <u-page-grid
      v-else-if="status === 'pending'"
      class="mt-10"
    >
      <base-loading-card
        v-for="_ in 15"
        :key="_"
      />
    </u-page-grid>

    <error-message
      v-else
      title="No venues found"
      :status
      error="Error fetching venues"
    />
  </paginated-overview>
</template>
