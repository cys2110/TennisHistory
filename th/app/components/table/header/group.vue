<script setup lang="ts" generic="T">
import type { Column } from "@tanstack/vue-table"

const {
  column,
  label,
  type = "alpha"
} = defineProps<{
  column: Column<T>
  label: string
  type?: "alpha" | "number"
}>()
</script>

<template>
  <div class="flex items-center gap-1 w-fit">
    <u-button
      :icon="column.getIsGrouped() ? ICONS.ungroup : ICONS.group"
      size="xs"
      variant="link"
      color="neutral"
      @click="() => column.toggleGrouping()"
    />
    <table-header-filter
      :column
      :label
      :type
    />
  </div>
</template>
