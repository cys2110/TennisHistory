<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
const letter = defineModel<string | undefined>()
const page = ref(1)
const sort = ref<SortType>()

const umpires = ref<string[]>([])

const { data, status, execute } = await useFetch<{ count: number; umpires: string[] }>("/api/umpires", {
  key: `umpires-${letter}-40-${page}`,
  query: { letter, page, skip: 40, sort },
  default: () => ({ count: 0, umpires: [] }),
  lazy: true,
  immediate: false,
  onResponse: ({ response }) => set(umpires, [...umpires.value, ...(response._data.umpires || [])])
})

execute()

// Reset skip and tournaments when the selected letter or sort options change
watch([sort, letter], () => {
  page.value = 1
  set(umpires, [])
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
        return status.value !== "pending" && data.value.count > umpires.value.length
      }
    }
  )
})

const columns: TableColumn<string>[] = [{ id: "umpire" }]
</script>

<template>
  <u-table
    ref="table"
    :data="umpires"
    :columns
    :loading="status === 'pending'"
    sticky
    empty="No umpires found"
    class="scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent w-fit min-w-sm mx-auto"
  >
    <template #umpire-header>
      <custom-sort-table-header
        label="Umpire"
        type="alpha"
        v-model="sort"
      />
    </template>

    <template #umpire-cell="{ row }">
      <u-link
        :to="{ name: 'umpire', params: { id: kebabCase(row.original) } }"
        class="hover-link"
      >
        {{ row.original }}
      </u-link>
    </template>
  </u-table>
</template>
