<script setup lang="ts">
import { SearchCard, PlayerCard } from "#components"

definePageMeta({ name: "search" })
useHead({ title: "Search", templateParams: { subPage: null } })
const toast = useToast()
const searchTerm = ref("")
const selectedTab = ref("")

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
const { data, status } = await useFetch<SearchAPIResponse>("/api/search-results", {
  query: { searchTerm },
  onResponseError: () => {
    toast.add({
      title: `Error fetching search results for ${searchTerm.value}`,
      icon: ICONS.error,
      color: "error"
    })
  },
  immediate: false
})

// Breadcrumbs
const items = [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Search", icon: ICONS.search }
]

// Set tabs
const tabItems = computed(() => {
  if (data.value) return data.value.categories.map(category => SEARCH_RESULTS[category as keyof typeof SEARCH_RESULTS])
})

// Set selected tab
watch(
  () => tabItems.value,
  () => {
    console.log(data.value)
    if (tabItems.value) selectedTab.value = tabItems.value[0].value
  }
)
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
          :icon="ICONS.search"
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
        :status
      />
    </nuxt-layout>
  </div>
</template>
