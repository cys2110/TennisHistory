<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
defineProps<{ entries: EventEntryType[] }>()

const columns: TableColumn<EventEntryType>[] = [
  { accessorKey: "country_id", header: "" },
  { accessorKey: "id", header: "" },
  { accessorKey: "last", header: "Player" },
  { accessorKey: "seed", header: "Seed" },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "rank", header: "Rank" }
]

// TODO: sorting
</script>

<template>
  <u-table
    :data="entries"
    :columns="columns"
  >
    <template #country_id-cell="{ row }">
      <flag-icon :country="row.original.country_id" />
    </template>

    <template #id-cell="{ row }">
      <player-avatar
        :id="row.original.id"
        :name="row.original.name"
      />
    </template>

    <template #last-cell="{ row }">
      <nuxt-link
        :to="{ name: 'players', params: { name: useChangeCase(row.original.name, 'kebabCase').value, id: row.original.id } }"
        class="hover-link"
      >
        {{ row.original.name }}
      </nuxt-link>
    </template>
  </u-table>
</template>
