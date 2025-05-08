<script setup lang="ts">
import { BaseLink, CountryLink, EventButtons, UButton } from "#components"
import type { TableColumn } from "@nuxt/ui"

defineProps<{
  events: EventCardType[]
  status: APIStatusType
  value: string
}>()

const route = useRoute()
const breakpoints = useBreakpoints(breakpointsTailwind)
const xlAndUp = breakpoints.greaterOrEqual("xl")

const columns: TableColumn<EventCardType>[] = [
  {
    accessorKey: "tournament",
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Tournament",
        icon: isSorted ? (isSorted === "asc" ? ICONS.sortAlphaUp : ICONS.sortAlphaDown) : ICONS.sortAlpha,
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      })
    },
    cell: ({ row }) => {
      const tournament = row.original.tournament
      return h(
        BaseLink,
        {
          type: "tournament",
          tournament,
          class: "md:text-xs lg:text-sm"
        },
        () => tournament.name
      )
    },
    meta: {
      class: { td: "max-w-20 xl:max-w-fit whitespace-normal break-words" }
    }
  },
  {
    accessorKey: "name",
    header: "Sponsor Name",
    meta: {
      class: { td: "max-w-20 xl:max-w-fit whitespace-normal break-words md:text-xs lg:text-sm" }
    }
  },
  {
    accessorKey: "category",
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Category",
        icon: isSorted ? (isSorted === "asc" ? ICONS.sortAlphaUp : ICONS.sortAlphaDown) : ICONS.sortAlpha,
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      })
    },
    cell: ({ row }) => {
      return h(
        BaseLink,
        {
          id: row.original.category as string,
          type: "category",
          class: "md:text-xs lg:text-sm"
        },
        () => row.getValue("category")
      )
    },
    meta: {
      class: { td: "md:text-xs lg:text-sm" }
    }
  },
  {
    accessorKey: "start_date",
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Dates",
        icon: isSorted ? (isSorted === "asc" ? ICONS.sortAlphaUp : ICONS.sortAlphaDown) : ICONS.sortAlpha,
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      })
    },
    cell: ({ row }) => row.original.dates,
    meta: {
      class: { td: "md:text-xs lg:text-sm" }
    }
  },
  {
    accessorKey: "surface",
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Surface",
        icon: isSorted ? (isSorted === "asc" ? ICONS.sortAlphaUp : ICONS.sortAlphaDown) : ICONS.sortAlpha,
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      })
    },
    cell: ({ row }) => {
      return h(BaseLink, {
        id: row.original.surface.id,
        type: "surface"
      })
    },
    meta: {
      class: { td: "md:text-xs lg:text-sm" }
    }
  },
  {
    accessorKey: "venues",
    header: "Venues",
    cell: ({ row }) => {
      const venues = row.original.venues
      return venues.map(venue => {
        return h(
          "div",
          {
            class: "flex gap-2 items-center w-fit mx-auto md:text-xs lg:text-sm"
          },
          [
            h(
              BaseLink,
              {
                id: venue.id,
                type: "venue",
                class: "max-w-20 xl:max-w-fit whitespace-normal break-words"
              },
              () => (venue.name ? `${venue.name}, ${venue.city}` : venue.city)
            ),
            h(CountryLink, { country: venue.country })
          ]
        )
      })
    }
  },
  {
    id: "navigation",
    header: "Go to...",
    cell: ({ row }) => {
      return h(EventButtons, {
        orientation: xlAndUp.value ? "horizontal" : "vertical",
        tournament: row.original.tournament,
        year: row.original.year,
        id: row.original.id,
        start_date: row.original.start_date,
        draw_type: row.original.draw_type
      })
    }
  }
]
</script>

<template>
  <u-table
    :data="events"
    :columns
    class="max-h-200"
    :loading="['pending', 'idle'].includes(status)"
    sticky
  >
    <template #loading>
      <div class="flex flex-col gap-4">
        <div
          v-for="_ in 6"
          :key="_"
          class="flex gap-8"
        >
          <u-skeleton
            v-for="_ in 6"
            :key="_"
            class="h-4 w-1/2 rounded-lg"
          />
          <u-skeleton class="h-4 w-1/3 rounded-lg ring-secondary-600 bg-secondary-600/10 dark:bg-secondary-400/10" />
        </div>
      </div>
    </template>
    <template #empty>
      {{
        route?.name === "surface"
          ? `No events found on ${value}`
          : route?.name === "supervisor"
          ? `No events supervised by ${value}`
          : route?.name === "upcoming-tournaments"
          ? "No upcoming tournaments"
          : route?.name === "archive-results"
          ? `No tournaments in ${value}`
          : route?.name === "venue"
          ? `No events took place at ${value}`
          : "No events found"
      }}
    </template>
  </u-table>
</template>
