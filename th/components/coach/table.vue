<script setup lang="ts">
import { UButton, ULink } from "#components"
import type { TableColumn } from "@nuxt/ui"
const { icons } = useAppConfig()
const skip = ref(0)
const selectedLetter = defineModel<string>()
const sort = ref<SortType | undefined>()

const coaches = ref<APICoachesResponseType["coaches"]>([])

const { data, status, execute } = await useFetch<APICoachesResponseType>("/api/coaches", {
  query: { letter: selectedLetter, skip, sort },
  default: () => ({ count: 0, coaches: [] }),
  lazy: true,
  immediate: false,
  onResponse: ({ response }) => (coaches.value = [...coaches.value, ...(response._data.coaches || [])])
})

execute()

// Reset skip and coaches when the selected letter or sort options change
watch([sort, selectedLetter], () => {
  skip.value = 0
  coaches.value = []
})

const columns: TableColumn<{ id: string; name: string }>[] = [
  {
    accessorKey: "name",
    header: () =>
      h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Coach",
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
            name: "coach",
            params: { id: encodeName(row.original.id) }
          }
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
        return status.value !== "pending" && data.value?.count > coaches.value.length
      }
    }
  )
})
</script>

<template>
  <u-table
    ref="table"
    :data="coaches"
    :columns
    class="max-h-200 min-w-2/3 md:min-w-1/2 lg:min-w-1/4 mx-auto"
    :loading="['pending', 'idle'].includes(status)"
    sticky
    empty="No coaches found"
  />
</template>
