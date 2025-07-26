<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
const letter = defineModel<string | undefined>()
const page = ref(1)
const sort = ref<SortType>()

const coaches = ref<PersonInterface[]>([])

const { data, status, execute } = await useFetch<{ count: number; coaches: PersonInterface[] }>("/api/coaches", {
  key: `coaches-${letter}-40-${page}`,
  query: { letter, page, skip: 40, sort },
  default: () => ({ count: 0, coaches: [] }),
  lazy: true,
  immediate: false,
  onResponse: ({ response }) => set(coaches, [...coaches.value, ...(response._data.coaches || [])])
})

execute()

// Reset skip and tournaments when the selected letter or sort options change
watch([sort, letter], () => {
  page.value = 1
  set(coaches, [])
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
        return status.value !== "pending" && data.value.count > coaches.value.length
      }
    }
  )
})

const columns: TableColumn<PersonInterface>[] = [{ accessorKey: "last_name" }]
</script>

<template>
  <u-table
    ref="table"
    :data="coaches"
    :columns
    :loading="status === 'pending'"
    sticky
    empty="No coaches found"
    class="scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent w-fit min-w-sm mx-auto"
  >
    <template #last_name-header>
      <custom-sort-table-header
        label="Coach"
        type="alpha"
        v-model="sort"
      />
    </template>

    <template #last_name-cell="{ row }">
      <u-link
        :to="{ name: 'coach', params: { id: kebabCase(row.original.id) } }"
        class="hover-link"
      >
        {{ row.original.first_name }} {{ row.original.last_name }}
      </u-link>
    </template>
  </u-table>
</template>
