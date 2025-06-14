<script setup lang="ts">
import { UButton, ULink } from "#components"
import type { TableColumn } from "@nuxt/ui"
const { icons } = useAppConfig()
const skip = ref(0)
const selectedLetter = defineModel<string>()
const sort = ref<SortType | undefined>()

const supervisors = ref<APISupervisorsResponseType["supervisors"]>([])

const { data, status, execute } = await useFetch<APISupervisorsResponseType>("/api/supervisors", {
  query: { letter: selectedLetter, skip, sort },
  default: () => ({ count: 0, supervisors: [] }),
  lazy: true,
  immediate: false,
  onResponse: ({ response }) => (supervisors.value = [...supervisors.value, ...(response._data.supervisors || [])])
})

execute()

// Reset skip and supervisors when the selected letter or sort options change
watch([sort, selectedLetter], () => {
  skip.value = 0
  supervisors.value = []
})

const columns: TableColumn<{ id: string; name: string }>[] = [
  {
    accessorKey: "name",
    header: () =>
      h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Supervisor",
        icon:
          sort.value ?
            sort.value === "ASC" ?
              icons.sortAlphaUp
            : icons.sortAlphaDown
          : icons.sortAlpha,
        onClick: () => {
          sort.value = sort.value === "ASC" ? "DESC" : "ASC"
        },
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      }),
    cell: ({ row }) =>
      h(
        ULink,
        {
          to: {
            name: "supervisor",
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
        return status.value !== "pending" && data.value?.count > supervisors.value.length
      }
    }
  )
})
</script>

<template>
  <u-table
    ref="table"
    :data="supervisors"
    :columns
    class="max-h-200 min-w-2/3 md:min-w-1/2 lg:min-w-1/4 mx-auto"
    :loading="['pending', 'idle'].includes(status)"
    sticky
    empty="No supervisors found"
  />
</template>
