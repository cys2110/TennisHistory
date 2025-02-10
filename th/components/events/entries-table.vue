<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
import STATUS_INFO from "~/utils/STATUS_INFO"
defineProps<{ entries: EventEntryType[] }>()
const UButton = resolveComponent("u-button")
const UIcon = resolveComponent("u-icon")

const columns: TableColumn<EventEntryType>[] = [
  {
    accessorKey: "country",
    header: "",
    meta: { class: { th: "text-center", td: "text-center" } }
  },
  {
    accessorKey: "id",
    header: "",
    meta: { class: { th: "text-center", td: "text-center" } }
  },
  {
    accessorKey: "last",
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Player",
        icon:
          isSorted ?
            isSorted === "asc" ?
              ICONS["sort-alpha-up"]
            : ICONS["sort-alpha-down"]
          : ICONS["sort-alpha"],
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        class: "-mx-2.5 font-semibold"
      })
    },
    meta: { class: { th: "text-slate-500 dark:text-slate-400", td: "text-slate-600 dark:text-slate-300" } }
  },
  { accessorKey: "name" },
  {
    accessorKey: "seed",
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Seed",
        icon:
          isSorted ?
            isSorted === "asc" ?
              ICONS["sort-number-up"]
            : ICONS["sort-number-down"]
          : ICONS["sort-number"],
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        class: "-mx-2.5 font-semibold"
      })
    },
    meta: { class: { th: "text-slate-500 dark:text-slate-400 text-center", td: "text-center text-slate-600 dark:text-slate-300" } }
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Status",
        icon:
          isSorted ?
            isSorted === "asc" ?
              ICONS["sort-alpha-up"]
            : ICONS["sort-alpha-down"]
          : ICONS["sort-alpha"],
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        class: "-mx-2.5 font-semibold"
      })
    },
    cell: ({ row }) => STATUS_INFO[row.getValue("status") as keyof typeof STATUS_INFO],
    meta: { class: { th: "text-slate-500 dark:text-slate-400 text-center", td: "text-center text-slate-600 dark:text-slate-300" } }
  },
  {
    accessorKey: "rank",
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Rank",
        icon:
          isSorted ?
            isSorted === "asc" ?
              ICONS["sort-number-up"]
            : ICONS["sort-number-down"]
          : ICONS["sort-number"],
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        class: "-mx-2.5 font-semibold"
      })
    },
    meta: { class: { th: "text-slate-500 dark:text-slate-400 text-center", td: "text-center text-slate-600 dark:text-slate-300" } }
  },
  {
    accessorKey: "withdrew",
    header: "Withdrew",
    cell: ({ row }) =>
      row.getValue("withdrew") ?
        typeof row.getValue("withdrew") === "boolean" ?
          h(UIcon, { name: ICONS.check, class: "text-red-300 text-xl" })
        : row.getValue("withdrew")
      : undefined,
    meta: { class: { th: "text-slate-500 dark:text-slate-400 text-center", td: "text-center text-slate-600 dark:text-slate-300" } }
  }
]

const columnVisibility = ref({
  name: false
})
</script>

<template>
  <div>
    <u-table
      :data="entries"
      :columns
      :column-visibility
    >
      <template #country-cell="{ row }">
        <flag-icon :country="row.getValue('country')" />
      </template>

      <template #id-cell="{ row }">
        <u-avatar
          :src="`https://www.atptour.com/-/media/alias/player-headshot/${row.getValue('id')}`"
          size="sm"
        />
      </template>

      <template #last-cell="{ row }">
        <nuxt-link
          :to="{ name: 'player', params: { name: useChangeCase(row.getValue('name'), 'kebabCase').value, id: row.getValue('id') } }"
          class="hover-link"
          :class="{ 'line-through': row.getValue('withdrew') }"
        >
          {{ row.getValue("name") }}
        </nuxt-link>
      </template>

      <template #seed-cell="{ row }">
        <span :class="{ 'line-through': row.getValue('withdrew') }">
          {{ row.getValue("seed") ?? undefined }}
        </span>
      </template>

      <template #status-cell="{ row }">
        <span :class="{ 'line-through': row.getValue('withdrew') }">
          {{ row.getValue("status") ?? undefined }}
        </span>
      </template>

      <template #rank-cell="{ row }">
        <span :class="{ 'line-through': row.getValue('withdrew') }">
          {{ row.getValue("rank") ?? "—" }}
        </span>
      </template>
    </u-table>
  </div>
</template>
