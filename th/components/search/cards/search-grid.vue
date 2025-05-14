<script setup lang="ts">
import { PlayerCard, SearchCard } from "#components"

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

const { data, status, searchTerm } = defineProps<{
  data: SearchAPIResponse | null
  status: APIStatusType
  searchTerm: string
}>()

const selectedTab = ref(data?.categories[0] ?? "")
const tabItems = computed(() => data?.categories.map((category: keyof typeof SEARCH_RESULTS) => SEARCH_RESULTS[category]) ?? [])

watch(
  () => data,
  () => {
    if (data?.categories) selectedTab.value = data.categories[0]
  }
)
</script>

<template>
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
    v-else-if="!['idle', 'pending'].includes(status) || searchTerm !== ''"
    :message="`No search results found for ${searchTerm}`"
  />
</template>
