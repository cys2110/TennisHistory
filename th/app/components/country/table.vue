<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
const letter = defineModel<string | undefined>()
const page = ref(1)
const sort = ref<SortType>()

const countries = ref<CountryInterface[]>([])

const { data, status, execute } = await useFetch<{ count: number; countries: CountryInterface[] }>("/api/countries", {
  key: `countries-${letter}-40-${page}`,
  query: { letter, page, skip: 40, sort },
  default: () => ({ count: 0, countries: [] }),
  lazy: true,
  immediate: false,
  onResponse: ({ response }) => set(countries, [...countries.value, ...(response._data.countries || [])])
})

execute()

// Reset skip and tournaments when the selected letter or sort options change
watch([sort, letter], () => {
  page.value = 1
  set(countries, [])
})

const table = useTemplateRef<ComponentPublicInstance>("table")
onMounted(() => {
  useInfiniteScroll(
    table.value?.$el,
    () => {
      page.value++
    },
    {
      distance: 50,
      canLoadMore: () => {
        return status.value !== "pending" && data.value.count > countries.value.length
      }
    }
  )
})

const columns: TableColumn<CountryInterface>[] = [{ accessorKey: "name" }]
</script>

<template>
  <u-table
    ref="table"
    :data="countries"
    :columns
    :loading="status === 'pending'"
    sticky
    empty="No countries found"
    class="scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent w-fit min-w-sm mx-auto"
  >
    <template #name-header>
      <custom-sort-table-header
        label="Country"
        type="alpha"
        v-model="sort"
      />
    </template>

    <template #name-cell="{ row }">
      <country-link
        :country="row.original"
        :icon-only="false"
        class="w-fit mx-auto"
      />
    </template>
  </u-table>
</template>
