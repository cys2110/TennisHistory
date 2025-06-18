<script setup lang="ts">
import { UBadge, UButton, ULink } from "#components"
import type { TableColumn } from "@nuxt/ui"
const { icons } = useAppConfig()
const skip = ref(0)
const selectedLetter = defineModel<string>()
const nameSort = ref<SortType | undefined>()
const establishedSort = ref<SortType | undefined>()
const abolishedSort = ref<SortType | undefined>()

const tournaments = ref<APITournamentsResponseType["tournaments"]>([])

const { data, status, execute } = await useFetch<APITournamentsResponseType>("/api/tournaments", {
  query: { letter: selectedLetter, skip, nameSort, establishedSort, abolishedSort },
  default: () => ({ count: 0, tournaments: [] }),
  lazy: true,
  immediate: false,
  onResponse: ({ response }) => (tournaments.value = [...tournaments.value, ...(response._data.tournaments || [])])
})

execute()

// Reset skip and tournaments when the selected letter or sort options change
watch([nameSort, selectedLetter, establishedSort, abolishedSort], () => {
  skip.value = 0
  tournaments.value = []
})

const columns: TableColumn<Pick<TournamentInterface, "id" | "name" | "established" | "abolished" | "tours">>[] = [
  {
    id: "tours",
    header: "Tours",
    cell: ({ row }) => {
      const tours = row.original.tours.filter(tour => tour !== "ITF")
      return h(
        "div",
        {
          class: "flex gap-2 items-center mx-auto w-fit"
        },
        tours.map(tour =>
          h(UBadge, {
            key: tour,
            color: tour.toLowerCase() as "atp" | "wta" | "men" | "women",
            label:
              tour === "Men" ? "ITF - Men's"
              : tour === "Women" ? "ITF - Women's"
              : tour
          })
        )
      )
    }
  },
  {
    accessorKey: "name",
    header: () =>
      h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Tournament",
        icon:
          nameSort.value ?
            nameSort.value === "ASC" ?
              icons.sortAlphaUp
            : icons.sortAlphaDown
          : icons.sortAlpha,
        onClick: () => {
          establishedSort.value = undefined
          abolishedSort.value = undefined
          nameSort.value = nameSort.value === "ASC" ? "DESC" : "ASC"
        },
        class: "-mx-2.5 font-semibold text-default"
      }),
    cell: ({ row }) => {
      const tournament = row.original
      return h(
        ULink,
        {
          to: {
            name: "tournament",
            params: { id: tournament.id, name: encodeName(tournament.name) }
          },
          class: "hover-link"
        },
        () => tournament.name
      )
    }
  },
  {
    accessorKey: "established",
    header: () =>
      h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Established",
        icon:
          establishedSort.value ?
            establishedSort.value === "ASC" ?
              icons.sortNumberUp
            : icons.sortNumberDown
          : icons.sortNumber,
        onClick: () => {
          nameSort.value = undefined
          abolishedSort.value = undefined
          establishedSort.value = establishedSort.value === "ASC" ? "DESC" : "ASC"
        },
        class: "-mx-2.5 font-semibold text-default"
      }),
    cell: ({ row }) => row.original.established ?? "—"
  },
  {
    accessorKey: "abolished",
    header: () =>
      h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Abolished",
        icon:
          abolishedSort.value ?
            abolishedSort.value === "ASC" ?
              icons.sortNumberUp
            : icons.sortNumberDown
          : icons.sortNumber,
        onClick: () => {
          nameSort.value = undefined
          establishedSort.value = undefined
          abolishedSort.value = abolishedSort.value === "ASC" ? "DESC" : "ASC"
        },
        class: "-mx-2.5 font-semibold text-default"
      }),
    cell: ({ row }) => row.original.abolished ?? "—"
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
      distance: 50,
      canLoadMore: () => {
        return status.value !== "pending" && data.value?.count > tournaments.value.length
      }
    }
  )
})
</script>

<template>
  <u-table
    ref="table"
    :data="tournaments"
    :columns
    class="max-h-200 min-w-2/3 md:min-w-1/2 lg:min-w-1/4 mx-auto"
    :loading="['pending', 'idle'].includes(status)"
    sticky
    empty="No tournaments found"
  />
</template>
