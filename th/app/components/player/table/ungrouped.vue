<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
const letter = defineModel<string | undefined>()
const page = ref(1)
const nameSort = ref<SortType>()
const startSort = ref<SortType>()
const endSort = ref<SortType>()
const countrySort = ref<SortType>()
const currentYear = new Date().getFullYear()

const players = ref<PlayerInterface[]>([])

const { data, status, execute } = await useFetch<PlayersAPIType>("/api/players", {
  key: `players-${letter}-40-${page}`,
  query: { letter, page, skip: 40, nameSort, startSort, endSort, countrySort },
  default: () => ({ count: 0, players: [] }),
  lazy: true,
  immediate: false,
  onResponse: ({ response }) => (players.value = [...players.value, ...(response._data.players || [])])
})

execute()

// Reset skip and players when the selected letter or sort options change
watch([nameSort, letter, startSort, endSort, countrySort], () => {
  set(page, 1)
  set(players, [])
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
        return status.value !== "pending" && data.value.count > players.value.length
      }
    }
  )
})

const columns: TableColumn<PlayerInterface>[] = [
  { accessorKey: "tour", header: "Tour" },
  { id: "status", header: "Status" },
  { id: "country" },
  { id: "name" },
  { accessorKey: "min_year" },
  { accessorKey: "max_year" }
]
</script>

<template>
  <u-table
    ref="table"
    :data="players"
    :columns
    :loading="status === 'pending'"
    sticky
    empty="No players found"
    class="scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent w-fit mx-auto"
  >
    <template #tour-cell="{ row }">
      <u-badge
        :color="getTourColor([row.original.tour])"
        :label="row.original.tour"
        class="mx-1"
      />
    </template>

    <template #status-cell="{ row }">
      <u-badge
        :color="row.original.min_year === currentYear ? 'active' : 'inactive'"
        :label="row.original.min_year === currentYear ? 'Active' : 'Inactive'"
      />
    </template>

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
        class="mx-auto w-fit"
      />
    </template>

    <template #name-header>
      <custom-sort-table-header
        label="Player"
        type="alpha"
        v-model="nameSort"
      />
    </template>

    <template #name-cell="{ row }">
      <u-link
        :to="{ name: 'player', params: { id: row.original.id, name: kebabCase(`${row.original.first_name} ${row.original.last_name}`) } }"
        class="hover-link"
      >
        {{ row.original.first_name }} {{ row.original.last_name }}
      </u-link>
    </template>

    <template #min_year-header>
      <custom-sort-table-header
        label="First year on Tour"
        type="number"
        v-model="startSort"
      />
    </template>

    <template #max_year-header>
      <custom-sort-table-header
        label="Last year on Tour"
        type="number"
        v-model="endSort"
      />
    </template>
  </u-table>
</template>
