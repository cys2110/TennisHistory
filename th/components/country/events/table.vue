<script setup lang="ts">
import { UBadge, UButton, ULink } from "#components"
import type { TableColumn } from "@nuxt/ui"

const { events, status } = defineProps<{
  events: Pick<EventInterface, "id" | "year" | "tournament" | "venues" | "tours">[]
  status: APIStatusType
}>()
const { icons } = useAppConfig()
const { params } = useRoute()
const name = computed(() => params.name as string)

const columns: TableColumn<Pick<EventInterface, "id" | "year" | "tournament" | "venues" | "tours">>[] = [
  {
    id: "tour",
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
    accessorKey: "year",
    header: ({ column }) =>
      h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Year",
        icon:
          column.getIsSorted() ?
            column.getIsSorted() === "asc" ?
              icons.sortNumberUp
            : icons.sortNumberDown
          : icons.sortNumber,
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        class: "-mx-2.5 font-semibold text-default"
      }),
    cell: ({ row }) =>
      h(
        ULink,
        {
          to: {
            name: "event",
            params: {
              id: row.original.tournament.id,
              name: encodeName(row.original.tournament.name),
              year: row.original.year,
              eid: row.original.id
            }
          },
          class: "hover-link"
        },
        () => row.original.year
      )
  },
  {
    accessorKey: "tournament.name",
    header: ({ column }) =>
      h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Tournament",
        icon:
          column.getIsSorted() ?
            column.getIsSorted() === "asc" ?
              icons.sortAlphaUp
            : icons.sortAlphaDown
          : icons.sortAlpha,
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        class: "-mx-2.5 font-semibold text-default"
      }),
    cell: ({ row }) =>
      h(
        ULink,
        {
          to: {
            name: "tournament",
            params: { id: row.original.tournament.id, name: encodeName(row.original.tournament.name) }
          },
          class: "hover-link"
        },
        () => row.original.tournament.name
      )
  },
  {
    id: "venue",
    header: "Venues",
    cell: ({ row }) =>
      h(
        "div",
        { class: "flex flex-col gap-1" },
        row.original.venues.map(venue =>
          h(
            ULink,
            {
              to: {
                name: "venue",
                params: { id: encodeName(venue.id) }
              },
              class: "hover-link w-fit mx-auto"
            },
            () => (venue.name ? `${venue.name}, ${venue.city}` : venue.city)
          )
        )
      )
  }
]
</script>

<template>
  <u-table
    :data="events"
    :columns
    class="max-h-200 max-w-full min-w-full md:min-w-3/4 xl:min-w-1/2 mx-auto mt-5"
    :loading="['pending', 'idle'].includes(status)"
    sticky
    :empty="`No events played in ${name}`"
  />
</template>
