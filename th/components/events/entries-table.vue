<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
defineProps<{ entries: EntryTableType[] }>()
const UButton = resolveComponent("u-button")

const columns: TableColumn<EntryTableType>[] = [
  {
    accessorKey: "last",
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Player",
        icon: isSorted ? (isSorted === "asc" ? ICONS.sortAlphaUp : ICONS.sortAlphaDown) : ICONS.sortAlpha,
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      })
    }
  },
  {
    accessorKey: "seed",
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Seed",
        icon: isSorted ? (isSorted === "asc" ? ICONS.sortNumberUp : ICONS.sortNumberDown) : ICONS.sortNumber,
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      })
    }
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Status",
        icon: isSorted ? (isSorted === "asc" ? ICONS.sortAlphaUp : ICONS.sortAlphaDown) : ICONS.sortAlpha,
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      })
    }
  },
  {
    accessorKey: "rank",
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Rank",
        icon: isSorted ? (isSorted === "asc" ? ICONS.sortNumberUp : ICONS.sortNumberDown) : ICONS.sortNumber,
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      })
    }
  },
  {
    accessorKey: "withdrew",
    header: "Withdrew"
  }
]
</script>

<template>
  <u-table
    :data="entries"
    :columns
    class="w-fit mx-auto my-5"
  >
    <template #last-cell="{ row }">
      <div class="flex items-center gap-2">
        <flag-icon :country="row.original.country" />
        <u-user
          :name="row.original.name"
          :avatar="{ src: `https://www.atptour.com/-/media/alias/player-headshot/${row.original.id}`, icon: ICONS.player }"
          :to="{ name: 'player', params: { id: row.original.id, name: encodeName(row.original.name) } }"
          prefetch-on="interaction"
          :ui="{ name: row.original.withdrew ? 'line-through' : '' }"
        />
      </div>
    </template>
    <template #status-cell="{ row }">
      <u-badge
        v-if="row.original.status"
        :class="STATUSES[row.original.status].class"
        :label="STATUSES[row.original.status].longName"
      />
    </template>

    <template #withdrew-cell="{ row }">
      <span v-if="typeof row.original.withdrew === 'string'">{{ row.getValue("withdrew") }}</span>
      <span v-else-if="row.original.withdrew">
        <u-icon
          :name="ICONS.success"
          class="text-error-600 dark:text-error-400 text-xl"
        />
      </span>
      <template v-else>{{ "" }}</template>
    </template>
  </u-table>
</template>
