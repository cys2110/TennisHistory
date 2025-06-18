<script setup lang="ts">
import { UBadge, UButton, UIcon, ULink } from "#components"
import type { TableColumn } from "@nuxt/ui"
const { icons } = useAppConfig()
const { players, status } = defineProps<{
  players: CountryNumberOneAPIResponseType
  status: APIStatusType
}>()

const formattedData = computed(() => {
  return [
    ...players.singles_players.map(player => ({
      ...player,
      ch_date: player.singles_ch_date,
      type: "Singles"
    })),
    ...players.doubles_players.map(player => ({
      ...player,
      ch_date: player.doubles_ch_date,
      type: "Doubles"
    }))
  ] as any
})

const route = useRoute()
const name = computed(() => route.params.name as string)
const currentYear = new Date().getFullYear()

const columns: TableColumn<
  Pick<PlayerInterface, "id" | "name" | "country" | "max_year" | "min_year" | "tour" | "last_name"> & {
    ch_date: string
    raw_date: string
    type: "Singles" | "Doubles"
  }
>[] = [
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
    id: "player",
    accessorKey: "last_name",
    header: ({ column }) =>
      h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Players",
        icon:
          column.getIsSorted() ?
            column.getIsSorted() === "asc" ?
              icons.sortAlphaUp
            : icons.sortAlphaDown
          : icons.sortAlpha,
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        class: "-mx-2.5 font-semibold text-default"
      }),
    cell: ({ row }) => {
      const { id, name, country, tour } = row.original
      return h(
        "div",
        {
          class: "flex items-center gap-2"
        },
        [
          h(
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
          ),
          h(
            ULink,
            {
              to: {
                name: "player",
                params: {
                  id,
                  name: encodeName(name)
                }
              },
              class: "hover-link font-bold"
            },
            () => name
          )
        ]
      )
    }
  },
  {
    id: "type",
    header: "Singles/Doubles",
    cell: ({ row }) =>
      h(UBadge, {
        color: row.original.type === "Singles" ? "singles" : "doubles",
        label: row.original.type
      })
  },
  {
    accessorKey: "raw_date",
    header: ({ column }) =>
      h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Date",
        icon:
          column.getIsSorted() ?
            column.getIsSorted() === "asc" ?
              icons.sortNumberUp
            : icons.sortNumberDown
          : icons.sortNumber,
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        class: "-mx-2.5 font-semibold text-default"
      }),
    cell: ({ row }) => row.original.ch_date
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) =>
      h(UBadge, {
        color: row.original.max_year === currentYear ? "active" : "inactive",
        variant: "outline",
        label: row.original.max_year === currentYear ? "Active" : "Inactive",
        class: "mx-auto w-fit"
      })
  }
]
</script>

<template>
  <u-table
    :data="formattedData"
    :columns
    class="max-h-160 max-w-full min-w-full md:min-w-3/4 xl:min-w-1/2 mx-auto mt-5"
    :loading="['pending', 'idle'].includes(status)"
    sticky
    :empty="`No players have achieved the No. 1 ranking representing ${name}`"
  />
</template>
