<script setup lang="ts">
import { SearchGrid, SearchTable } from "#components"

useHead({ title: "Search", templateParams: { subPage: null } })
const appConfig = useAppConfig()
const toast = useToast()
const { viewMode } = useViewMode()
const searchTerm = ref("")

// Breadcrumbs
const items = [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Search", icon: appConfig.ui.icons.search }
]

interface SearchAPIResponse {
  categories: ("Player" | "Tournament" | "Coach" | "Country" | "Venue" | "Surface" | "Supervisor" | "Umpire")[]
  results: {
    labels: string[]
    country: CountryInterface | null
    min_year: string | null
    max_year: string | null
    name: string
    city: string | null
    id: string
    alpha2: string | null
  }[]
}

// API call
const { data, status, execute } = await useFetch<SearchAPIResponse>("/api/search-results", {
  query: { searchTerm },
  immediate: false,
  onResponseError: ({ error }) => {
    toast.add({
      title: `Error fetching results for ${searchTerm.value}`,
      description: error?.message,
      icon: appConfig.ui.icons.error,
      color: "error"
    })
    showError(error!)
  }
})

watch(searchTerm, term => {
  if (term.trim().length > 0) {
    execute()
  }
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
            <u-breadcrumb :items />
          </template>
        </u-dashboard-navbar>

        <u-dashboard-toolbar>
          <u-input
            v-model="searchTerm"
            class="w-full"
            placeholder="Search for players, tournaments, coaches, umpires, countries, venues and supervisors"
            :icon="appConfig.ui.icons.search"
            :loading="status === 'pending'"
          />
        </u-dashboard-toolbar>
      </template>

      <template #body>
        <component
          :is="viewMode === 'cards' ? SearchGrid : SearchTable"
          :data
          :status
          :searchTerm
        />
      </template>
    </u-dashboard-panel>
  </div>
</template>
