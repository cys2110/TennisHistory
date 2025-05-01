<script setup lang="ts">
import { PlayerCard, SearchCard } from "#components"

useHead({ title: "Search", templateParams: { subPage: null } })
const appConfig = useAppConfig()
const toast = useToast()
const searchTerm = ref("")
const selectedTab = ref("")
const tabItems = ref([])

// Breadcrumbs
const items = [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Search", icon: appConfig.ui.icons.search }
]

interface SearchAPIResponse {
  categories: string[]
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
  onResponse: ({ response }) => {
    tabItems.value = response._data.categories.map(
      (category: keyof typeof SEARCH_RESULTS) => SEARCH_RESULTS[category]
    )
    selectedTab.value = response._data.categories[0]
  },
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
  <div>
    <nuxt-layout name="default">
      <template #title>
        <u-breadcrumb :items />
      </template>

      <template #toolbar>
        <u-input
          v-model="searchTerm"
          class="w-full"
          placeholder="Search for players, tournaments, coaches, umpires, countries, venues and supervisors"
          :icon="appConfig.ui.icons.search"
          :loading="status === 'pending'"
        />
      </template>

      <u-tabs
        v-if="data"
        v-model="selectedTab"
        :items="tabItems"
        variant="pill"
      />
      <u-page-columns v-if="data">
        <template
          v-for="item in data.results"
          :key="item.id"
        >
          <component
            v-if="item.labels.includes(selectedTab)"
            :is="item.labels.includes('Player') ? PlayerCard : SearchCard"
            :player="item"
            :result="item"
            :type="selectedTab"
          />
        </template>
      </u-page-columns>
      <error-message
        v-else-if="searchTerm !== '' && status !== 'pending'"
        :icon="ICONS.noSearch"
        :title="`No search results found for ${searchTerm}`"
      />
    </nuxt-layout>
  </div>
</template>
