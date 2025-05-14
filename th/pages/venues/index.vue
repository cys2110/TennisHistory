<script setup lang="ts">
import { VenuesGrid, VenuesTable } from "#components"

useHead({ title: "Venues", templateParams: { subPage: null } })
const { viewMode } = useViewMode()
const appConfig = useAppConfig()
const toast = useToast()

const selectedLetter = ref<string>("All")
const skip = ref(0)
const sort = ref<"ASC" | "DESC">("ASC")
const venues = ref<
  {
    country: CountryInterface
    cities: {
      city: string
      venues: Pick<VenueInterface, "id" | "name">[]
    }[]
  }[]
>([])

// Breadcrumbs
const breadcrumbs = [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Venues", icon: ICONS.venue }
]

interface APIResponseType {
  count: number
  countries: {
    country: CountryInterface
    cities: {
      city: string
      venues: Pick<VenueInterface, "id" | "name">[]
    }[]
  }[]
}

// API call
const { data, status, execute } = await useFetch<APIResponseType>("/api/venues", {
  query: { skip, sort, letter: selectedLetter },
  default: () => ({ count: 0, countries: [] }),
  lazy: true,
  immediate: false,
  onResponse: ({ response }) => (venues.value = [...venues.value, ...(response._data.countries || [])]),
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

execute()

watch([sort, selectedLetter], () => {
  skip.value = 0
  venues.value = []
})
</script>

<template>
  <div class="w-full">
    <u-dashboard-panel>
      <template #header>
        <u-dashboard-navbar>
          <template #leading>
            <u-dashboard-sidebar-collapse />
          </template>

          <template #title>
            <u-breadcrumb :items="breadcrumbs" />
          </template>
        </u-dashboard-navbar>

        <u-dashboard-toolbar>
          <letters-select v-model="selectedLetter" />
        </u-dashboard-toolbar>
      </template>

      <template #body>
        <component
          :is="viewMode === 'cards' ? VenuesGrid : VenuesTable"
          :key="viewMode"
          v-model="skip"
          v-model:sort="sort"
          :venues
          :status
          :count="data?.count ?? 0"
        />
      </template>
    </u-dashboard-panel>
  </div>
</template>
