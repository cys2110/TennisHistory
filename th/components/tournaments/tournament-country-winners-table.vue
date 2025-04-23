<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
const UButton = resolveComponent("u-button")
const id = useRouteParams<string>("id")
const paramName = useRouteParams<string>("name")
const name = computed(() => decodeName(paramName.value))

interface APIResponse {
  wins: string
  country: CountryInterface
  total_wins: string
}

// API call
const { data: countries, status } = await useFetch<APIResponse[]>("/api/tournament-country-winners", { query: { id } })

const columns: TableColumn<APIResponse>[] = [
  { id: "country", header: "Country" },
  {
    accessorKey: "wins",
    header: ({ column }) => {
      const isSorted = column.getIsSorted()
      return h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Wins",
        icon: isSorted ? (isSorted === "asc" ? ICONS.sortNumberUp : ICONS.sortNumberDown) : ICONS.sortNumber,
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      })
    }
  },
  {
    accessorKey: "total_wins",
    header: ({ column }) => {
      const isSorted = column.getIsSorted()
      return h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Total Wins",
        icon: isSorted ? (isSorted === "asc" ? ICONS.sortNumberUp : ICONS.sortNumberDown) : ICONS.sortNumber,
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      })
    }
  }
]
</script>

<template>
  <u-table
    v-if="countries || status === 'pending'"
    :data="countries || []"
    :columns="columns"
    :loading="status === 'pending'"
  >
    <template #empty>
      <div
        v-if="status === 'pending'"
        class="flex flex-col gap-4"
      >
        <div
          v-for="_ in 6"
          :key="_"
          class="flex gap-8"
        >
          <u-skeleton
            v-for="_ in 3"
            :key="_"
            class="h-4 w-1/2 rounded-lg"
          />
        </div>
      </div>
      <template v-else>No stats available</template>
    </template>
    <template #country-cell="{ row }">
      <flag-icon :country="row.original.country" />
      {{ row.original.country.name }}
    </template>
  </u-table>
  <error-message
    v-else
    :icon="ICONS.noCountries"
    :status
    :title="`No winners by country found for ${name}`"
    :error="`Error fetching winners by country for ${name}`"
  />
</template>
