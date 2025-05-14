<script setup lang="ts">
import { UButton, UIcon, ULink } from "#components"
import type { TableColumn } from "@nuxt/ui"

interface APIResponse {
  wins: string
  country: CountryInterface
  total_wins: string
}

defineProps<{ countries: APIResponse[]; status: APIStatusType }>()
const route = useRoute()
const name = computed(() => decodeName(route.params.name as string))

const columns: TableColumn<APIResponse>[] = [
  {
    id: "country",
    header: "Country",
    cell: ({ row }) => {
      return h(
        ULink,
        {
          class: "grid grid-cols-2 gap-2 items-center",
          to: {
            name: "country",
            params: { id: row.original.country.id }
          }
        },
        () => [
          h(UIcon, {
            name: row.original.country.alpha2 ? `flag:${row.original.country.alpha2}-4x3` : `flags:${row.original.country.id}`,
            class: "ml-auto"
          }),
          h("div", { class: "flex justify-start hover-link w-fit" }, row.original.country.name)
        ]
      )
    }
  },
  {
    accessorKey: "wins",
    header: ({ column }) => {
      const isSorted = column.getIsSorted()
      return h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Wins by Unique Players",
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
    :data="countries"
    :columns="columns"
    :loading="['pending', 'idle'].includes(status)"
  >
    <template #loading>
      <div
        v-for="_ in 6"
        :key="_"
        class="flex gap-8"
      >
        <u-skeleton
          v-for="_ in 5"
          :key="_"
          class="h-4 rounded-lg"
        />
      </div>
    </template>
    <template #empty> No countries by winners found for {{ name }} </template>
  </u-table>
</template>
