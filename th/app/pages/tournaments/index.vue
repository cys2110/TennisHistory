<script setup lang="ts">
import { FilterTableHeader, InputTableHeader, RangeTableHeader, UBadge, ULink } from "#components"
import type { TableColumn } from "@nuxt/ui"
import { type Column, getFacetedRowModel, getFacetedUniqueValues } from "@tanstack/vue-table"
const { viewMode } = useDefaults()
useHead({ title: "Tournaments" })
const { icons } = useAppConfig()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1024 })
const mdAndDown = breakpoints.smallerOrEqual("md")

useJsonld(() => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Tournaments",
  description: "A collection of tennis tournaments"
}))

const selectedLetter = ref<string | undefined>()

// API call
const { data: tournaments, status } = await useFetch<TournamentInterface[]>("/api/tournaments", {
  key: "tournaments",
  default: () => []
})

const filteredTournaments = computed(() => {
  if (tournaments.value && selectedLetter.value) {
    return tournaments.value.filter(tournament => tournament.name.startsWith(selectedLetter.value!))
  }
  return tournaments.value
})

// TOC
const toc = computed(() => [
  {
    id: "tournaments",
    items: filteredTournaments.value.map(tournament => ({
      label: tournament.name,
      to: `#tournament-${tournament.id}`
    }))
  }
])

const arraySorting = (rowA: any, rowB: any, columnId: string) => {
  return useSorted(rowA.getValue(columnId)).value[0] < useSorted(rowB.getValue(columnId)).value[0] ? -1 : 1
}

const columns: TableColumn<TournamentInterface>[] = [
  {
    id: "tours",
    accessorFn: row => row.tours.map(tour => tour.replace("Men", "ITF (M)").replace("Women", "ITF (W)")),
    header: ({ column }) =>
      h(FilterTableHeader, {
        column: column as Column<unknown>,
        label: "Tours",
        type: "alpha"
      }),
    cell: ({ row }) =>
      row.original.tours.map(tour =>
        h(UBadge, {
          key: tour,
          label: tour.replace("Men", "ITF (M)").replace("Women", "ITF (W)"),
          color: getTourColour([tour]),
          class: "mx-1"
        })
      ),
    sortingFn: (rowA, rowB, columnId) => arraySorting(rowA, rowB, columnId),
    filterFn: "arrIncludes"
  },
  {
    accessorKey: "name",
    header: ({ column }) =>
      h(InputTableHeader, {
        column: column as Column<unknown>,
        label: "Tournaments"
      }),
    cell: ({ row }) =>
      h(
        ULink,
        {
          class: "hover-link",
          to: { name: "tournament", params: { id: row.original.id, name: kebabCase(row.original.name) } }
        },
        () => row.original.name
      ),
    footer: ({ table }) => "Total: " + table.getFilteredRowModel().rows.length
  },
  {
    accessorKey: "established",
    sortUndefined: "last",
    header: ({ column }) =>
      h(RangeTableHeader, {
        column: column as Column<unknown>,
        label: "Established"
      })
  },
  {
    accessorKey: "abolished",
    sortUndefined: "last",
    header: ({ column }) =>
      h(RangeTableHeader, {
        column: column as Column<unknown>,
        label: "Abolished"
      })
  }
]

const columnFilters = ref([])
</script>

<template>
  <div class="w-full">
    <u-dashboard-panel>
      <template #header>
        <u-dashboard-navbar>
          <template #title>
            <page-title />
          </template>

          <template
            #right
            v-if="viewMode !== 'list'"
          >
            <u-slideover
              v-if="mdAndDown"
              title="Filters"
              class="ml-auto"
            >
              <u-button
                :icon="icons.filter"
                size="xs"
              />
              <template #body>
                <filter-letters v-model="selectedLetter" />
              </template>
            </u-slideover>

            <u-popover>
              <u-button
                :size="mdAndDown ? 'xs' : 'sm'"
                :icon="icons.toc"
              />
              <template #content>
                <u-command-palette
                  placeholder="Search tournaments"
                  :groups="toc"
                  :loading="status === 'pending'"
                  :fuse="{ resultLimit: 1000 }"
                  :ui="{ content: 'max-h-80', root: 'border border-primary rounded-lg' }"
                />
              </template>
            </u-popover>
          </template>
        </u-dashboard-navbar>

        <u-dashboard-toolbar v-if="!mdAndDown && viewMode !== 'list'">
          <filter-letters
            v-model="selectedLetter"
            :ui="{ fieldset: 'flex-wrap gap-2' }"
          />
        </u-dashboard-toolbar>
      </template>

      <template #body>
        <u-table
          v-if="viewMode === 'list'"
          :data="tournaments"
          :columns
          :loading="status === 'pending'"
          sticky
          empty="No tournaments found"
          v-model:columnFilters="columnFilters"
          :faceted-options="{
            getFacetedRowModel: getFacetedRowModel(),
            getFacetedUniqueValues: getFacetedUniqueValues()
          }"
          :ui="{
            root: 'w-fit mx-auto scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent'
          }"
        />

        <u-page-grid
          v-else-if="tournaments.length || status === 'pending'"
          class="xl:grid-cols-4 2xl:grid-cols-5 p-5 scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent overflow-y-auto scroll-smooth"
        >
          <div
            v-if="tournaments.length"
            v-for="tournament in filteredTournaments"
            :key="tournament.id"
            :id="`tournament-${tournament.id}`"
          >
            <u-page-card
              :title="tournament.name"
              highlight
              :highlight-color="getTourColour(tournament.tours)"
              :to="{ name: 'tournament', params: { id: tournament.id, name: kebabCase(tournament.name) } }"
              :ui="{ title: 'text-center', body: 'w-full mx-auto', description: 'text-center' }"
            >
              <template #leading>
                <u-badge
                  v-for="tour in tournament.tours"
                  :key="tour"
                  :color="getTourColour([tour])"
                  :label="tour.replace('Men', 'ITF (M)').replace('Women', 'ITF (W)')"
                  class="mx-1"
                />
              </template>

              <template #description>
                <span v-if="tournament.established">{{ tournament.established }}</span>
                <span v-if="tournament.established && !tournament.abolished"> - present</span>
                <span v-else-if="tournament.abolished && tournament.established !== tournament.abolished"> - {{ tournament.abolished }}</span>
              </template>
            </u-page-card>
          </div>

          <loading-base
            v-else
            v-for="_ in 10"
            :key="_"
          />
        </u-page-grid>
        <error-message
          v-else
          message="No tournaments found"
          :icon="icons.noTournament"
        />
      </template>

      <template
        #footer
        v-if="viewMode !== 'list'"
      >
        <div class="font-semibold p-5 border-t border-muted">Total: {{ filteredTournaments.length }}</div>
      </template>
    </u-dashboard-panel>
  </div>
</template>
