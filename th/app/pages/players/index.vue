<script setup lang="ts">
useHead({ title: "Players" })
const { viewMode } = useViewMode()

const skip = ref(0)
const players = ref<PlayerInterface[]>([])

const baseFilters: PlayerFiltersType = {
  players: [],
  tour: undefined,
  countries: [],
  minYear: undefined,
  maxYear: undefined,
  status: undefined,
  coaches: []
}
const filters = ref<PlayerFiltersType>(baseFilters)
const resetFilters = () => set(filters, baseFilters)

const reset = () => {
  set(skip, 0)
  set(players, [])
}

watchDeep(filters, reset)
watchOnce(players, () => {
  if (get(players).length === 0) {
    reset()
  }
})

const { data, status, execute } = await useFetch<{ count: number; players: PlayerInterface[] }>("/api/players", {
  key: () => `players-${JSON.stringify(get(filters))}-${get(skip)}`,
  query: {
    skip,
    filters
  },
  default: () => ({ count: 0, players: [] }),
  onResponse: ({ response }) => {
    set(players, [...get(players), ...(response._data?.players || [])])
  },
  lazy: true,
  immediate: false
})

execute()
</script>

<template>
  <div class="w-full">
    <player-cards
      v-if="viewMode === 'cards'"
      :players
      v-model:skip="skip"
      :resetFilters
      :status
      :count="data.count"
      v-model:filters="filters"
    />

    <player-table
      v-else
      :players
      v-model:skip="skip"
      :resetFilters
      :status
      :count="data.count"
      v-model:filters="filters"
    />
  </div>
</template>
