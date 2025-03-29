<script setup lang="ts">
import { PlayerSearchCard } from "#components"
import SearchCard from "~/components/search/search-card.vue"
import VenueSearchCard from "~/components/search/venue-search-card.vue"

definePageMeta({ name: "search", layout: false })
useHead({ title: "Search", templateParams: { subPage: null } })
const toast = useToast()
const searchTerm = ref("")
const selectedTab = ref("")

// API call
const { data, status } = await useFetch<{ categories: string[]; results: { labels: string[]; properties: any }[] }>("/api/search-results", {
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

const tabItems = computed(() => {
  if (data.value) return data.value.categories.map(category => SEARCH_RESULTS[category as keyof typeof SEARCH_RESULTS])
})

watch(
  () => tabItems.value,
  () => {
    if (tabItems.value) selectedTab.value = tabItems.value[0].value
  }
)
</script>

<template>
  <div>
    <nuxt-layout name="default">
      <template #title>Search</template>
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
          :key="item.properties.id"
        >
          <component
            v-if="item.labels.includes(selectedTab)"
            :is="item.labels.includes('Player') ? PlayerSearchCard : item.labels.includes('Venue') ? VenueSearchCard : SearchCard"
            :result="item"
            :type="selectedTab"
          />
        </template>
      </u-page-columns>
      <error-message
        v-else-if="searchTerm !== '' && status !== 'pending'"
        :icon="ICONS['no-search']"
        :title="`No search results found for ${searchTerm}`"
      />
    </nuxt-layout>
  </div>
</template>
