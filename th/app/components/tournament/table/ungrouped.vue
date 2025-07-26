<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
const letter = defineModel<string | undefined>()
const page = ref(1)
const nameSort = ref<SortType>()
const establishedSort = ref<SortType>()
const abolishedSort = ref<SortType>()

const tournaments = ref<TournamentInterface[]>([])

const { data, status, execute } = await useFetch<TournamentsAPIType>("/api/tournaments", {
  key: `tournaments-${letter}-40-${page}`,
  query: { letter, page, skip: 40, nameSort, establishedSort, abolishedSort },
  default: () => ({ count: 0, tournaments: [] }),
  lazy: true,
  immediate: false,
  onResponse: ({ response }) => (tournaments.value = [...tournaments.value, ...(response._data.tournaments || [])])
})

execute()

// Reset skip and tournaments when the selected letter or sort options change
watch([nameSort, letter, establishedSort, abolishedSort], () => {
  page.value = 1
  tournaments.value = []
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
        return status.value !== "pending" && data.value.count > tournaments.value.length
      }
    }
  )
})

const columns: TableColumn<TournamentInterface>[] = [
  {
    accessorKey: "tours",
    header: "Tours"
  },
  { accessorKey: "name" },
  { accessorKey: "established" },
  { accessorKey: "abolished" }
]
</script>

<template>
  <u-table
    ref="table"
    :data="tournaments"
    :columns
    :loading="status === 'pending'"
    sticky
    empty="No tournaments found"
    class="scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent w-fit mx-auto"
  >
    <template #tours-cell="{ row }">
      <u-badge
        v-for="tour in row.original.tours"
        :key="tour"
        :color="getTourColor([tour])"
        :label="tour"
        class="mx-1"
      />
    </template>

    <template #name-header>
      <custom-sort-table-header
        label="Tournament"
        type="alpha"
        v-model="nameSort"
      />
    </template>

    <template #name-cell="{ row }">
      <u-link
        :to="{ name: 'tournament', params: { id: row.original.id, name: kebabCase(row.original.name) } }"
        class="hover-link"
      >
        {{ row.original.name }}
      </u-link>
    </template>

    <template #established-header>
      <custom-sort-table-header
        label="Established"
        type="number"
        v-model="establishedSort"
      />
    </template>

    <template #abolished-header>
      <custom-sort-table-header
        label="Abolished"
        type="number"
        v-model="abolishedSort"
      />
    </template>
  </u-table>
</template>
