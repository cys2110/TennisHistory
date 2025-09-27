<script setup lang="ts" generic="T">
import type { Column } from "@tanstack/vue-table"

const { column, label } = defineProps<{
  column: Column<T>
  label: string
}>()

const columnFilterValue = computed({
  get: () => column.getFilterValue() as string,
  set: (value: any) => column.setFilterValue(value)
})
</script>

<template>
  <div class="w-fit flex justify-center items-center mx-auto">
    <table-header-sort
      :column
      type="alpha"
    />
    <u-input
      v-model="columnFilterValue"
      :placeholder="`Search ${label}`"
      class="w-fit"
      size="sm"
    />
  </div>
</template>
