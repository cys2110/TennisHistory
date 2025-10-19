<script setup lang="ts">
useHead({ title: "Tournaments" })
const { viewMode } = useViewMode()

const skip = ref(0)
const tournaments = ref<TournamentInterface[]>([])

const filters = reactive<TournamentFiltersType>({
  tours: [],
  tournaments: [],
  established: undefined,
  abolished: undefined
})
const resetFilters = () => {
  filters.tours = []
  filters.tournaments = []
  filters.established = undefined
  filters.abolished = undefined
}

const reset = () => {
  set(skip, 0)
  set(tournaments, [])
}

watchDeep(filters, reset)

const { data, status, execute } = await useFetch<{ count: number; tournaments: TournamentInterface[] }>("/api/tournaments", {
  key: () => `tournaments-${JSON.stringify(get(filters))}-${get(skip)}`,
  query: {
    skip,
    filters
  },
  default: () => ({ count: 0, tournaments: [] }),
  onResponse: ({ response }) => {
    set(tournaments, [...get(tournaments), ...(response._data?.tournaments || [])])
  },
  lazy: true,
  immediate: false
})

execute()
</script>

<template>
  <div class="w-full">
    <tournament-cards
      v-if="viewMode === 'cards'"
      :tournaments
      v-model:skip="skip"
      :resetFilters
      :status
      :count="data.count"
      v-model:filters="filters"
    />

    <tournament-table
      v-else
      :tournaments
      v-model:skip="skip"
      :resetFilters
      :status
      :count="data.count"
      v-model:filters="filters"
    />
  </div>
</template>
