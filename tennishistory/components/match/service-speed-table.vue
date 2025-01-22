<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
defineProps<{
  stats: {
    name: string
    p1: {
      low: number
      high: number
    }
    p2: {
      low: number
      high: number
    }
  }[]
  p1_name: string
  p2_name: string
  p1_id: string
  p2_id: string
}>()

const columns: TableColumn<{ name: string; p1: { low: number; high: number }; p2: { low: number; high: number } }>[] = [{ id: "p1" }, { accessorKey: "name", header: "Category" }, { id: "p2" }]
</script>

<template>
  <u-table
    :data="stats"
    :columns
  >
    <template #p1-header>
      <div class="flex gap-2">
        <player-avatar
          :id="p1_id"
          :name="p1_name"
        />
        <span>{{ p1_name }}</span>
      </div>
    </template>
    <template #p1-cell="{ row }">
      <div class="flex flex-col">
        <div>{{ row.original.p1.low }} km/h</div>
        <div>{{ Math.round(row.original.p1.low / 1.609344) }} mph</div>
      </div>
    </template>

    <template #p2-header>
      <div class="flex gap-2">
        <player-avatar
          :id="p1_id"
          :name="p1_name"
        />
        <span>{{ p1_name }}</span>
      </div>
    </template>
    <template #p2-cell="{ row }">
      <div class="flex flex-col">
        <div>{{ row.original.p2.low }} km/h</div>
        <div>{{ Math.round(row.original.p1.low / 1.609344) }} mph</div>
      </div>
    </template>
  </u-table>
</template>
