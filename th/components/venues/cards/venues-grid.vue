<script setup lang="ts">
defineProps<{ breadcrumbs: BreadcrumbType[] }>()
const appConfig = useAppConfig()
const toast = useToast()

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
  <u-dashboard-panel>
    <template #header>
      <u-dashboard-navbar>
        <template #leading>
          <u-dashboard-sidebar-collapse />
        </template>

        <template #title>
          <u-breadcrumb :items="breadcrumbs" />
        </template>
        <template #right>
          <set-page-size v-model="pageSize" />
        </template>
      </u-dashboard-navbar>

      <u-dashboard-toolbar>
        <letters-radio-group v-model="selectedLetter" />
      </u-dashboard-toolbar>
    </template>

    <template #body>
      <error-message
        v-if="status === 'error' || !data.count"
        title="No venues found"
      />
      <u-page-grid v-else>
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
      <pagination-component
        v-if="data.count"
        v-model="page"
        :total="data.count"
        :page-size="pageSize"
      />
    </template>
  </u-dashboard-panel>
</template>
