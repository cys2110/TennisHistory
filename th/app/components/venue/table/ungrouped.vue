<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
const letter = defineModel<string | undefined>()
const page = ref(1)
const countrySort = ref<SortType>()
const citySort = ref<SortType>()
const venueSort = ref<SortType>()

const venues = ref<VenueInterface[]>([])

const { data, status, execute } = await useFetch<{ count: number; venues: VenueInterface[] }>("/api/venues/ungrouped", {
  key: `venues-${letter}-40-${page}`,
  query: { letter, page, skip: 40, countrySort, citySort, venueSort },
  default: () => ({ count: 0, venues: [] }),
  lazy: true,
  immediate: false,
  onResponse: ({ response }) => set(venues, [...venues.value, ...(response._data.venues || [])])
})

execute()

// Reset skip and tournaments when the selected letter or sort options change
watch([countrySort, letter, citySort, venueSort], () => {
  set(page, 1)
  set(venues, [])
})

const table = useTemplateRef<ComponentPublicInstance>("table")
onMounted(() => {
  useInfiniteScroll(
    table.value?.$el,
    () => {
      page.value++
    },
    {
      distance: 50,
      canLoadMore: () => {
        return status.value !== "pending" && data.value.count > venues.value.length
      }
    }
  )
})

const columns: TableColumn<VenueInterface>[] = [{ accessorKey: "country" }, { accessorKey: "city" }, { accessorKey: "name", header: "Venue" }]
</script>

<template>
  <u-table
    ref="table"
    :data="venues"
    :columns
    :loading="status === 'pending'"
    sticky
    empty="No venues found"
    class="scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent w-fit md:min-w-full xl:min-w-1/2 mx-auto"
  >
    <template #country-header>
      <custom-sort-table-header
        label="Country"
        type="alpha"
        v-model="countrySort"
      />
    </template>

    <template #country-cell="{ row }">
      <country-link
        :country="row.original.country"
        :icon-only="false"
      />
    </template>

    <template #city-header>
      <custom-sort-table-header
        label="City"
        type="alpha"
        v-model="citySort"
      />
    </template>

    <template #city-cell="{ row }">
      <u-link
        v-if="!row.original.name"
        :to="{ name: 'venue', params: { id: kebabCase(row.original.id) } }"
        class="hover-link"
      >
        {{ row.original.city }}
      </u-link>
      <template v-else>{{ row.original.city }}</template>
    </template>

    <template #name-header>
      <custom-sort-table-header
        label="Venue"
        type="alpha"
        v-model="venueSort"
      />
    </template>

    <template #name-cell="{ row }">
      <u-link
        v-if="row.original.name"
        :to="{ name: 'venue', params: { id: kebabCase(row.original.id) } }"
        class="hover-link"
      >
        {{ row.original.name }}
      </u-link>
    </template>
  </u-table>
</template>
