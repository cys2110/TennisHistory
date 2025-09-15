<script setup lang="ts" generic="T">
import type { TableRow } from "@nuxt/ui"

defineProps<{
  row: TableRow<T>
  grouping: string[]
  groupingColumnId: string
}>()
const {
  ui: { icons }
} = useAppConfig()
</script>

<template>
  <div class="flex items-center gap-2">
    <u-button
      v-if="row.getIsGrouped() && grouping[0] === groupingColumnId"
      :icon="icons.chevronDoubleRight"
      size="xs"
      variant="link"
      color="neutral"
      @click="row.toggleExpanded()"
      :ui="{ leadingIcon: row.getIsExpanded() ? 'rotate-90 transition-transform duration-200' : 'transition-transform duration-200' }"
    />
    <template
      v-if="
        row.getValue(groupingColumnId) &&
        ((row.getIsGrouped() && row.groupingColumnId === groupingColumnId) || (!grouping.includes(groupingColumnId) && !row.getIsGrouped()))
      "
    >
      <slot />
    </template>
  </div>
</template>
