<script setup lang="ts">
import { type TableColumn, type TableRow } from "@nuxt/ui"

const { status, count, tournaments } = defineProps<{
  tournaments: TournamentInterface[]
  resetFilters: () => void
  count: number
  status: APIStatusType
}>()
const skip = defineModel<number>("skip")
const filters = defineModel<TournamentFiltersType>("filters")
const table = useTemplateRef<any>("table")

onMounted(() => {
  useInfiniteScroll(
    table.value?.$el,
    () => {
      set(skip, get(skip)! + 40)
    },
    {
      distance: 50,
      canLoadMore: () => {
        return get(status) !== "pending" && count > tournaments.length
      }
    }
  )
})

const columns: TableColumn<TournamentInterface>[] = [
  { accessorKey: "tours" },
  { accessorKey: "name" },
  { accessorKey: "established" },
  { accessorKey: "abolished" }
]

const handleSelect = async (row: TableRow<TournamentInterface>) => {
  await navigateTo({ name: "tournament", params: { id: row.original.id, name: kebabCase(row.original.name ?? "-") } })
}
</script>

<template>
  <u-dashboard-panel>
    <template #header>
      <u-dashboard-navbar>
        <template #title> <page-title /> </template>
      </u-dashboard-navbar>

      <u-dashboard-toolbar>
        <dev-only>
          <tournament-create />
        </dev-only>

        <u-button
          label="Reset Filters"
          :icon="ICONS.noFilter"
          @click="resetFilters"
          block
        />

        <table-visibility
          v-if="table"
          :table="table!"
        />
      </u-dashboard-toolbar>
    </template>

    <template #body>
      <u-table
        ref="table"
        :data="tournaments"
        :columns
        :loading="status === 'pending'"
        sticky
        render-fallback-value="—"
        @select="handleSelect"
        :ui="{ tbody: '[&>tr]:cursor-pointer' }"
      >
        <template #loading>
          <loading-table-message />
        </template>
        <template #empty>
          <empty-table
            message="No tournaments found"
            :icon="ICONS.noTournament"
          />
        </template>
        <template #tours-header>
          <form-select-menu
            v-if="filters"
            v-model="filters.tours"
            :items="Object.entries(TourEnum).map(tour => ({ value: tour[0], label: tour[1] }))"
            placeholder="Tour"
            :icon="ICONS.tour"
            multiple
          />
        </template>
        <template #tours-cell="{ row }">
          <div class="flex justify-center items-center gap-1">
            <u-badge
              v-for="tour in row.original.tours"
              :key="tour"
              :label="TourEnum[tour]"
              :color="tour"
            />
          </div>
        </template>

        <template #name-header>
          <form-select-search
            v-if="filters"
            v-model="filters.tournaments"
            placeholder="Tournament"
            type="tournaments"
            :icon="ICONS.tournament"
          />
        </template>
        <template #established-header>
          <form-input
            v-if="filters"
            v-model="filters.established"
            type="number"
            placeholder="Year Established"
            block
          />
        </template>
        <template #abolished-header>
          <form-input
            v-if="filters"
            v-model="filters.abolished"
            type="number"
            placeholder="Year Abolished"
            block
          />
        </template>
      </u-table>
    </template>
  </u-dashboard-panel>
</template>
