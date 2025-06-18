<script setup lang="ts">
import { UButton, ULink } from "#components"
import type { TableColumn } from "@nuxt/ui"
const { icons } = useAppConfig()
const skip = ref(0)
const selectedLetter = defineModel<string>()
const sort = ref<SortType | undefined>()

const umpires = ref<APIUmpiresResponseType["umpires"]>([])

const { data, status, execute } = await useFetch<APIUmpiresResponseType>("/api/umpires", {
  query: { letter: selectedLetter, skip, sort },
  default: () => ({ count: 0, umpires: [] }),
  lazy: true,
  immediate: false,
  onResponse: ({ response }) => (umpires.value = [...umpires.value, ...(response._data.umpires || [])])
})

execute()

// Reset skip and umpires when the selected letter or sort options change
watch([sort, selectedLetter], () => {
  skip.value = 0
  umpires.value = []
})

const columns: TableColumn<{ id: string; name: string }>[] = [
  {
    accessorKey: "name",
    header: () =>
      h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Umpire",
        icon:
          sort.value ?
            sort.value === "ASC" ?
              icons.sortAlphaUp
            : icons.sortAlphaDown
          : icons.sortAlpha,
        onClick: () => {
          sort.value = sort.value === "ASC" ? "DESC" : "ASC"
        },
        class: "-mx-2.5 font-semibold text-default"
      }),
    cell: ({ row }) =>
      h(
        ULink,
        {
          to: {
            name: "umpire",
            params: { id: encodeName(row.original.id) }
          },
          class: "hover-link"
        },
        () => row.original.name
      )
  }
]

const table = useTemplateRef<ComponentPublicInstance>("table")

onMounted(() => {
  useInfiniteScroll(
    table.value?.$el,
    () => {
      skip.value += 40
    },
    {
      distance: 200,
      canLoadMore: () => {
        return status.value !== "pending" && data.value?.count > umpires.value.length
      }
    }
  )
})
</script>

<template>
  <u-table
    ref="table"
    :data="umpires"
    :columns
    class="max-h-200 min-w-2/3 md:min-w-1/2 lg:min-w-1/4 mx-auto"
    :loading="['pending', 'idle'].includes(status)"
    sticky
    empty="No umpires found"
  />
</template>
