<script setup lang="ts">
import { UBadge, UButton, UIcon, ULink } from "#components"
import type { TableColumn } from "@nuxt/ui"
const { icons } = useAppConfig()
const skip = ref(0)
const selectedLetter = defineModel<string>()
const nameSort = ref<SortType | undefined>()
const startSort = ref<SortType | undefined>()
const endSort = ref<SortType | undefined>()
const countrySort = ref<SortType | undefined>()

const players = ref<APIPlayersResponseType["players"]>([])

const { data, status, execute } = await useFetch<APIPlayersResponseType>("/api/players", {
  query: { letter: selectedLetter, skip, nameSort, startSort, endSort, countrySort },
  default: () => ({ count: 0, players: [] }),
  lazy: true,
  immediate: false,
  onResponse: ({ response }) => (players.value = [...players.value, ...(response._data.players || [])])
})

execute()

// Reset skip and players when the selected letter or sort options change
watch([nameSort, selectedLetter, startSort, endSort, countrySort], () => {
  skip.value = 0
  players.value = []
})

const columns: TableColumn<Pick<PlayerInterface, "id" | "name" | "country" | "min_year" | "max_year" | "tour">>[] = [
  {
    id: "tour",
    header: "Tour",
    cell: ({ row }) =>
      h(UBadge, {
        color: row.original.tour.toLowerCase() as "atp" | "wta",
        label: row.original.tour
      })
  },
  {
    accessorKey: "country.name",
    header: () =>
      h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Country",
        icon:
          countrySort.value ?
            countrySort.value === "ASC" ?
              icons.sortAlphaUp
            : icons.sortAlphaDown
          : icons.sortAlpha,
        onClick: () => {
          startSort.value = undefined
          endSort.value = undefined
          nameSort.value = undefined
          countrySort.value = countrySort.value === "ASC" ? "DESC" : "ASC"
        },
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      }),
    cell: ({ row }) => {
      const country = row.original.country
      return h(
        ULink,
        {
          to: {
            name: "country",
            params: { id: country.id, name: encodeName(country.name) }
          }
        },
        () =>
          h(UIcon, {
            name: getFlagCode(country),
            class: "text-xl"
          })
      )
    }
  },
  {
    accessorKey: "name",
    header: () =>
      h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Player",
        icon:
          nameSort.value ?
            nameSort.value === "ASC" ?
              icons.sortAlphaUp
            : icons.sortAlphaDown
          : icons.sortAlpha,
        onClick: () => {
          startSort.value = undefined
          endSort.value = undefined
          countrySort.value = undefined
          nameSort.value = nameSort.value === "ASC" ? "DESC" : "ASC"
        },
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      }),
    cell: ({ row }) => {
      const player = row.original
      return h(
        ULink,
        {
          to: {
            name: "player",
            params: { id: player.id, name: encodeName(player.name) }
          },
          class: "hover-link"
        },
        () => player.name
      )
    }
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) =>
      h(UBadge, {
        color: row.original.max_year === new Date().getFullYear() ? "active" : "inactive",
        label: row.original.max_year === new Date().getFullYear() ? "Active" : "Inactive"
      })
  },
  {
    accessorKey: "min_year",
    header: () =>
      h(UButton, {
        color: "neutral",
        variant: "link",
        label: "First year on tour",
        icon:
          startSort.value ?
            startSort.value === "ASC" ?
              icons.sortNumberUp
            : icons.sortNumberDown
          : icons.sortNumber,
        onClick: () => {
          nameSort.value = undefined
          endSort.value = undefined
          countrySort.value = undefined
          startSort.value = startSort.value === "ASC" ? "DESC" : "ASC"
        },
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      }),
    cell: ({ row }) => row.original.min_year ?? "—"
  },
  {
    accessorKey: "max_year",
    header: () =>
      h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Last Year on Tour",
        icon:
          endSort.value ?
            endSort.value === "ASC" ?
              icons.sortNumberUp
            : icons.sortNumberDown
          : icons.sortNumber,
        onClick: () => {
          nameSort.value = undefined
          startSort.value = undefined
          countrySort.value = undefined
          endSort.value = endSort.value === "ASC" ? "DESC" : "ASC"
        },
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      }),
    cell: ({ row }) => row.original.max_year ?? "—"
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
        return status.value !== "pending" && data.value?.count > players.value.length
      }
    }
  )
})
</script>

<template>
  <u-table
    ref="table"
    :data="players"
    :columns
    class="max-h-200 min-w-2/3 md:min-w-1/2 lg:min-w-1/4 mx-auto"
    :loading="['pending', 'idle'].includes(status)"
    sticky
    empty="No players found"
  />
</template>
