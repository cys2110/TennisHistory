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
const {
  ui: { icons }
} = useAppConfig()

const columnFilterValue = computed({
  get: () => (column.getFilterValue() as string[]) ?? [],
  set: (value: any) => column.setFilterValue(Array.isArray(value) ? value : value ? [value] : [])
})

const sortedUniqueValues = computed(() => {
  const facetedValues = Array.from(column.getFacetedUniqueValues().keys()) // get faceted values
    .filter(Boolean) // filter any undefined values
    .flat() // flatten the array in case any unique values are arrays
    .sort((a, b) => {
      if (type === "alpha") {
        return a.localeCompare(b)
      } else {
        return parseFloat(a) - parseFloat(b)
      }
    }) // sort the values

  return useArrayUnique(facetedValues).value // Return only unique values
})
</script>

<template>
  <div class="w-fit flex justify-center items-center gap-1 mx-auto">
    <table-header-sort
      :column
      :type
    />
    <u-select-menu
      v-model="columnFilterValue"
      :items="sortedUniqueValues"
      class="w-fit max-w-50"
      :placeholder="label"
      multiple
    >
      <template #content-bottom>
        <u-button
          :trailing-icon="icons.close"
          color="neutral"
          variant="link"
          size="xs"
          @click="columnFilterValue = []"
          label="Clear"
          block
          class="border-t rounded-t-none border-muted"
        />
      </template>
    </u-select-menu>
  </div>
</template>
