<script setup lang="ts">
import { BaseLink, PlayerAvatar, UIcon, ULink } from "#components"
import type { TableColumn } from "@nuxt/ui"

interface SearchAPIResponse {
  categories: ("Player" | "Tournament" | "Coach" | "Country" | "Venue" | "Surface" | "Supervisor" | "Umpire")[]
  results: {
    labels: string[]
    country: CountryInterface | null
    min_year: string | null
    max_year: string | null
    name: string
    city: string | null
    id: string
    alpha2: string | null
  }[]
}

const { data, status, searchTerm } = defineProps<{
  data: SearchAPIResponse | null
  status: APIStatusType
  searchTerm: string
}>()

const columns: TableColumn<{
  labels: string[]
  country: CountryInterface | null
  min_year: string | null
  max_year: string | null
  name: string
  city: string | null
  id: string
  alpha2: string | null
}>[] = [
  {
    id: "type",
    header: "Type",
    cell: ({ row }) => row.original.labels.join(" | ")
  },
  {
    id: "result",
    header: "Result",
    cell: ({ row }) => {
      if (row.original.labels.includes("Player")) {
        return h(PlayerAvatar, {
          player: { id: row.original.id, name: row.original.name, country: row.original.country! }
        })
      } else if (row.original.labels.includes("Country")) {
        return h(
          "div",
          {
            class: "flex items-center gap-2"
          },
          () => [
            h(UIcon, {
              name: row.original.alpha2 ? `flag:${row.original.alpha2}-4x3` : `flags:${row.original.id}`
            }),
            h(
              BaseLink,
              {
                type: "country",
                id: row.original.id
              },
              () => row.original.name
            )
          ]
        )
      } else if (row.original.labels.includes("Tournament")) {
        return h(BaseLink, {
          type: "tournament",
          tournament: { id: row.original.id, name: row.original.name }
        })
      } else if (row.original.labels.includes("Venue")) {
        return h(
          BaseLink,
          {
            type: "venue",
            id: row.original.id
          },
          () => (row.original.name ? `${row.original.name}, ${row.original.city}` : row.original.city)
        )
      } else {
        return h(BaseLink, {
          type: row.original.labels[0].toLowerCase(),
          id: row.original.id
        })
      }
    }
  }
]
</script>

<template>
  <u-table
    v-if="data"
    :data="data.results"
    :columns
    class="max-h-200 min-w-2/3 md:min-w-1/2 lg:min-w-1/4 mx-auto"
    :loading="['pending', 'idle'].includes(status)"
    sticky
  >
    <template #loading>
      <div
        v-for="_ in 6"
        :key="_"
        class="flex gap-8"
      >
        <u-skeleton class="h-4 w-full rounded-lg" />
      </div>
    </template>
    <template #empty> No results found for {{ searchTerm }} </template>
  </u-table>
</template>
