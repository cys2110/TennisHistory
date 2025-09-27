<script setup lang="ts" generic="T">
import type { Column } from "@tanstack/vue-table"

const { column, label } = defineProps<{
  column: Column<T>
  label: string
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
    .sort((a, b) => a.localeCompare(b)) // sort the values

  const uniqueValues = useArrayUnique(facetedValues) // Return only unique values

  return uniqueValues.value.map(value => {
    const nameArray = value.split(", ")
    return `${nameArray[1]} ${nameArray[0]}`
  })
})
</script>

<template>
  <div class="w-fit flex justify-center items-center gap-2 mx-auto">
    <table-header-sort
      :column
      type="alpha"
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
