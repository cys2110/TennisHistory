<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
defineProps<{ stats: MatchStatsType[]; p1_name: string; p2_name: string; p1_id: string; p2_id: string }>()

const columns: TableColumn<MatchStatsType>[] = [{ id: "p1" }, { accessorKey: "name", header: "Category" }, { id: "p2" }]
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
        <div>{{ row.original.p1 ?? "—" }}</div>
        <div v-if="row.original.p1_pc">{{ row.original.p1_pc.low }}%</div>
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
        <div>{{ row.original.p2 ?? "—" }}</div>
        <div v-if="row.original.p2_pc">{{ row.original.p2_pc.low }}%</div>
      </div>
    </template>
  </u-table>
</template>
