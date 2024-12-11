<script setup lang="ts">
import { type Ref, ref, watch } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import Tab from 'primevue/tab'
import TabList from 'primevue/tablist'
import Tabs from 'primevue/tabs'
import TabPanels from 'primevue/tabpanels'
import { GET_SEARCH } from '@/services/MiscService'
import type { SearchResults } from '@/utils/types'

document.title = 'Search | TennisHistory'

const searchTerm: Ref<string | null> = ref(null)
const noMatch: Ref<boolean | null> = ref(null)
const results: Ref<SearchResults | null> = ref(null)

const { query, variables } = GET_SEARCH('Search')
const { result, loading, error, refetch } = useQuery(query, variables)

watch(result, (newResult: SearchResults) => {
  if (newResult) {
    if (Object.values(newResult).every((val) => val.length === 0)) {
      noMatch.value = true
    } else {
      noMatch.value = false
    }
    results.value = newResult
  }
},)

watch(error, (newError) => {
  if (newError) console.error(newError)
})

const handleSearch = () => {
  if (typeof searchTerm.value === 'string') refetch({ searchTerm: searchTerm.value })
}
</script>

<template>
  <Title>
    <template #title>Search</template>
  </Title>
  <div class="mb-3 w-3/4 mx-auto">
    <IconField>
      <InputText
        placeholder="Search for players, tournaments, coaches, umpires, venues, countries, surfaces and umpires"
        type="text" v-model="searchTerm" @update:model-value="handleSearch" class="w-full" size="small" />
      <InputIcon class="pi pi-search" />
    </IconField>
  </div>

  <div v-if="noMatch === true" class="my-10 text-3xl text-zinc-400 w-3/4 mx-auto">No results matching search</div>

  <Tabs value="0" v-if="noMatch === false && results" class="w-3/4 mx-auto">
    <TabList>
      <Tab value="0" v-if="results.searchPlayers.length > 0">Players</Tab>
      <Tab value="1" v-if="results.searchTournaments.length > 0">Tournaments</Tab>
      <Tab value="2" v-if="results.searchCountries.length > 0">Countries</Tab>
      <Tab value="3" v-if="results.searchCoaches.length > 0">Coaches</Tab>
      <Tab value="4" v-if="results.searchUmpires.length > 0">Umpires</Tab>
      <Tab value="5" v-if="results.searchSurface.length > 0">Surfaces</Tab>
      <Tab value="6" v-if="results.searchVenue.length > 0">Venues</Tab>
      <Tab value="7" v-if="results.searchSupervisors.length > 0">Supervisors</Tab>
    </TabList>
    <TabPanels>
      <SearchPlayers v-if="results.searchPlayers.length > 0" :players="results.searchPlayers" />
      <SearchTournaments v-if="results.searchTournaments.length > 0" :tournaments="results.searchTournaments" />
      <CountryResults v-if="results.searchCountries.length > 0" :countries="results.searchCountries" />
      <CoachResults v-if="results.searchCoaches.length > 0" :coaches="results.searchCoaches" />
      <UmpireResults v-if="results.searchUmpires.length > 0" :umpires="results.searchUmpires" />
      <SurfaceResults v-if="results.searchSurface.length > 0" :surfaces="results.searchSurface" />
      <VenueResults v-if="results.searchVenue.length > 0" :venues="results.searchVenue" />
      <SupervisorResults v-if="results.searchSupervisors.length > 0" :supervisors="results.searchSupervisors" />
    </TabPanels>
  </Tabs>
</template>