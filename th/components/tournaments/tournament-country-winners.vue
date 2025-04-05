<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
const UButton = resolveComponent("u-button")
const id = useRouteParams<string>("id")
const paramName = useRouteParams<string>("name")
const name = computed(() => decodeName(paramName.value))
const toast = useToast()

interface APIResponse {
  wins: string
  country: CountryInterface
}

// API call
const { data: countries, status } = await useFetch<APIResponse[]>("/api/tournament-country-winners", {
  query: { id },
  onResponseError: () => {
    toast.add({
      title: `Error fetching winners by country for ${name.value}`,
      icon: ICONS.error,
      color: "error"
    })
  }
})

const columns: TableColumn<APIResponse>[] = [
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
  { id: "country", header: "Country" }
]
</script>

<template>
  <dashboard-subpanel
    title="Countries by No. of Winners"
    :icon="ICONS.countries"
  >
    <u-table
      v-if="countries"
      :data="countries"
      :columns="columns"
    >
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
    />
  </dashboard-subpanel>
</template>
