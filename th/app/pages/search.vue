<script setup lang="ts">
import { UIcon } from "#components"
import type { TableColumn, TableRow } from "@nuxt/ui"

const {
  icons,
  ui: { icons: uIcons }
} = useAppConfig()
const searchTerm = ref("")
useHead({ title: () => searchTerm.value || "Search" })

interface APIResponse {
  labels: string[]
  country: CountryInterface
  id: string
  name: string
  alpha2: string
  city: string
  first_name: string
  last_name: string
}

// API call
const { data, status, execute } = await useFetch<APIResponse[]>("/api/search", {
  query: { searchTerm },
  immediate: false,
  server: false
})

watch(searchTerm, term => {
  if (term.trim().length > 0) {
    execute()
  }
})

const columns: TableColumn<APIResponse>[] = [
  {
    accessorKey: "labels",
    header: ""
  },
  {
    id: "result",
    cell: ({ row }) => {
      const labels = row.original.labels

      if (labels.includes("Player")) {
        return h(
          "div",
          {
            class: "flex items-center gap-2"
          },
          [h(UIcon, { name: getFlagCode(row.original.country) }), h("div", {}, `${row.original.first_name} ${row.original.last_name}`)]
        )
      } else if (labels.includes("Country")) {
        return h(
          "div",
          {
            class: "flex items-center gap-2"
          },
          [h(UIcon, { name: getFlagCode(row.original) }), h("div", {}, row.original.name)]
        )
      } else if (labels.includes("Venue")) {
        return h(
          "div",
          {
            class: "flex items-center gap-2"
          },
          [
            h("div", {}, row.original.name ? `${row.original.name}, ${row.original.city}` : row.original.city),
            h(UIcon, { name: getFlagCode(row.original.country) })
          ]
        )
      } else {
        return labels.includes("Tournament") ? row.original.name : row.original.id
      }
    }
  }
]

const handleSelectRow = async (row: TableRow<APIResponse>) => {
  const pageName = row.original.labels[0]!.toLowerCase()

  const params =
    pageName === "player" ? { id: row.original.id, name: kebabCase(`${row.original.first_name} ${row.original.last_name}`) }
    : pageName === "country" ? { id: row.original.id, name: kebabCase(row.original.name) }
      // @ts-ignore
    : pageName === "tournament" ? { id: row.original.id.low, name: kebabCase(row.original.name) }
    : { id: kebabCase(row.original.id) }

  // @ts-ignore
  await navigateTo({
    name: pageName,
    params
  })
}
</script>

<template>
  <div class="w-full">
    <u-dashboard-panel>
      <template #header>
        <u-dashboard-navbar>
          <template #title>
            <page-title />
          </template>
        </u-dashboard-navbar>

        <u-dashboard-toolbar>
          <u-input
            v-model="searchTerm"
            :icon="uIcons.search"
            placeholder="Search for players, tournaments, coaches, umpires, countries, venues and supervisors"
            class="w-full"
          />
        </u-dashboard-toolbar>
      </template>

      <template #body>
        <u-table
          :data
          :columns
          :loading="status === 'pending'"
          sticky
          @select="handleSelectRow"
          :ui="{ root: 'w-fit min-w-1/3 mx-auto', tbody: '[&>tr]:cursor-pointer', td: 'empty:p-0' }"
        >
          <template #loading>
            <u-icon
              :name="uIcons.loading"
              class="size-8"
            />
          </template>

          <template #empty>
            <div class="flex justify-center items-center w-full gap-2 text-error">
              <u-icon
                :name="icons.noSearch"
                class="text-base"
              />
              No results found
            </div>
          </template>
          <
          <template #labels-cell="{ row }">
            <u-badge
              v-for="label in row.original.labels"
              :key="`${row.original.id}-${label}`"
              :label
              :icon="SEARCH_CATEGORIES[label as keyof typeof SEARCH_CATEGORIES]?.icon"
              :color="SEARCH_CATEGORIES[label as keyof typeof SEARCH_CATEGORIES]?.color"
            />
          </template>
        </u-table>
      </template>
    </u-dashboard-panel>
  </div>
</template>
