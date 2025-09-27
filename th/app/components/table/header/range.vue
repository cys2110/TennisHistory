<script setup lang="ts" generic="T">
import type { Column } from "@tanstack/vue-table"

const { column, label } = defineProps<{
  column: Column<T>
  label: string
}>()

const columnFilterValue = computed(() => column.getFilterValue())
</script>

<template>
  <div class="w-fit mx-auto *:flex *:justify-center *:items-center *:gap-2">
    <table-header-sort
      :column
      :label
      type="number"
    />
    <div>
      <u-input
        type="number"
        :min="Number(column.getFacetedMinMaxValues()?.[0] ?? '')"
        :max="Number(column.getFacetedMinMaxValues()?.[1] ?? '')"
        :model-value="(columnFilterValue as [number, number])?.[0] ?? ''"
        @update:model-value="column.setFilterValue((old: [number, number]) => [$event, old?.[1]])"
        placeholder="Min"
        size="sm"
        class="min-w-13"
      />
      <u-input
        type="number"
        :min="Number(column.getFacetedMinMaxValues()?.[0] ?? '')"
        :max="Number(column.getFacetedMinMaxValues()?.[1] ?? '')"
        :model-value="(columnFilterValue as [number, number])?.[0] ?? ''"
        @update:model-value="column.setFilterValue((old: [number, number]) => [old?.[0], $event])"
        placeholder="Max"
        size="sm"
        class="min-w-13"
      />
    </div>
  </div>
</template>
