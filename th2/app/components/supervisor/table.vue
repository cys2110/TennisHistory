<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
const letter = defineModel<string | undefined>()
const page = ref(1)
const sort = ref<SortType>()

const supervisors = ref<string[]>([])

const { data, status, execute } = await useFetch<{ count: number; supervisors: PersonInterface[] }>("/api/supervisors", {
  key: `supervisors-${letter}-40-${page}`,
  query: { letter, page, skip: 40, sort },
  default: () => ({ count: 0, supervisors: [] }),
  lazy: true,
  immediate: false,
  onResponse: ({ response }) => set(supervisors, [...supervisors.value, ...(response._data.supervisors || [])])
})

execute()

// Reset skip and tournaments when the selected letter or sort options change
watch([sort, letter], () => {
  page.value = 1
  set(supervisors, [])
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
        return status.value !== "pending" && data.value.count > supervisors.value.length
      }
    }
  )
})

const columns: TableColumn<string>[] = [{ id: "supervisor" }]
</script>

<template>
  <u-table
    ref="table"
    :data="supervisors"
    :columns
    :loading="status === 'pending'"
    sticky
    empty="No supervisors found"
    class="scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent w-fit min-w-sm mx-auto"
  >
    <template #supervisor-header>
      <custom-sort-table-header
        label="Supervisor"
        type="alpha"
        v-model="sort"
      />
    </template>

    <template #supervisor-cell="{ row }">
      <u-link
        :to="{ name: 'supervisor', params: { id: kebabCase(row.original) } }"
        class="hover-link"
      >
        {{ row.original }}
      </u-link>
    </template>
  </u-table>
</template>
