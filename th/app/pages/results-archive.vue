<script setup lang="ts">
useHead({ title: "Results Archive" })
const { viewMode } = useViewMode()

const skip = ref(0)
const events = ref<EventInterface[]>([])

const baseFilters: EventFiltersType = {
  tours: [],
  tournaments: [],
  levels: [],
  categories: [],
  dateRange: { start: undefined, end: undefined },
  surfaces: [],
  venues: [],
  countries: [],
  supervisors: [],
  umpires: [],
  environment: undefined,
  year: undefined
}
const filters = ref<EventFiltersType>(baseFilters)
const resetFilters = () => set(filters, baseFilters)

const reset = () => {
  set(skip, 0)
  set(events, [])
}

watchDeep(filters, reset)

const { data, status, execute } = await useFetch<{ count: number; events: EventInterface[] }>("/api/results-archive", {
  key: () => `events-${JSON.stringify(get(filters))}-${get(skip)}`,
  query: {
    skip,
    filters
  },
  default: () => ({ count: 0, events: [] }),
  onResponse: ({ response }) => {
    set(events, [...get(events), ...(response._data?.events || [])])
  },
  lazy: true,
  immediate: false
})

execute()
</script>

<template>
  <div class="w-full">
    <archive-cards
      v-if="viewMode === 'cards'"
      :events
      v-model:skip="skip"
      :resetFilters
      :status
      :count="data.count"
      v-model:filters="filters"
    />

    <archive-table
      v-else
      :events
      v-model:skip="skip"
      :resetFilters
      :status
      :count="data.count"
      v-model:filters="filters"
    />
  </div>
</template>
