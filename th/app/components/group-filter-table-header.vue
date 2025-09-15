<script setup lang="ts" generic="T">
import type { Column } from "@tanstack/vue-table"

const { column, label, type } = defineProps<{
  column: Column<T>
  label: string
  type: "alpha" | "number"
}>()
const { icons } = useAppConfig()
</script>

<template>
  <div class="flex items-center gap-1 w-fit">
    <u-button
      :icon="column.getIsGrouped() ? icons.ungroup : icons.group"
      size="xs"
      variant="link"
      color="neutral"
      @click="() => column.toggleGrouping()"
    />
    <filter-table-header
      :column
      :label
      :type
    />
  </div>
</template>
