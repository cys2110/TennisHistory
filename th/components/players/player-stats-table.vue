<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
defineProps<{ stats: PlayerStatsInterface[] | null; status: string }>()

const columns: TableColumn<{ category: string; value: number; suffix?: boolean }>[] = [
  { accessorKey: "category", header: "", meta: { class: { th: "w-1/2", td: "w-1/3" } } },
  { accessorKey: "value", header: "", meta: { class: { th: "w-2/3", td: "w-2/3" } } }
]
</script>

<template>
  <u-table
    :data="stats || []"
    :columns
    class="w-full md:w-3/4 lg:w-2/3 xl:w-1/2 mx-auto"
    :loading="['pending', 'idle'].includes(status)"
  >
    <template #empty>
      <div
        v-if="['pending', 'idle'].includes(status)"
        class="flex flex-col gap-4"
      >
        <div
          v-for="_ in 6"
          :key="_"
          class="flex gap-8"
        >
          <u-skeleton class="h-4 w-1/2 rounded-lg" />
          <u-skeleton class="h-4 w-1/2 rounded-lg" />
        </div>
      </div>
      <template v-else>No stats available</template>
    </template>
    <template #value-cell="{ row }">
      <template v-if="row.original.suffix === false">{{ row.original.value }}</template>
      <u-progress
        v-else
        v-model="row.original.value"
        :max="100"
        :ui="{ base: 'bg-primary-300 dark:bg-primary-950', indicator: 'bg-primary-600', status: '!w-full text-(--ui-text-muted)' }"
      >
        <template #status="{ percent }">{{ percent }}%</template>
      </u-progress>
    </template>
  </u-table>
</template>
