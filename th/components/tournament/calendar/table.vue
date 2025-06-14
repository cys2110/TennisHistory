<script setup lang="ts">
import { UButton, UIcon, ULink } from "#components"
import type { TableColumn } from "@nuxt/ui"
const { events, status, value } = defineProps<{
  events: EventCardType[]
  status: APIStatusType
  value?: string
}>()
const {
  icons,
  ui: { icons: appIcons }
} = useAppConfig()
const { name, query, params } = useRoute()

const columns: TableColumn<EventCardType>[] = [
  {
    id: "expand",
    cell: ({ row }) =>
      h(UButton, {
        color: "neutral",
        variant: "link",
        class: "transition-transform duration-200 " + (row.getIsExpanded() ? "rotate-90" : "rotate-0"),
        icon: appIcons.chevronDoubleRight,
        onClick: () => row.toggleExpanded()
      })
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
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      }),
    cell: ({ row }) => {
      const tournament = row.original.tournament
      return h(
        ULink,
        {
          to: {
            name: "tournament",
            params: {
              id: tournament.id,
              name: encodeName(tournament.name)
            }
          },
          class: "hover-link"
        },
        () => tournament.name
      )
    }
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const { category, atp_category, wta_category, tours } = row.original
      if (category) {
        if (value === category) {
          return h(
            "span",
            {
              class:
                tours.includes("ATP") ? "text-atp"
                : tours.includes("WTA") ? "text-wta"
                : tours.includes("Men") ? "men"
                : "women"
            },
            category
          )
        } else {
          return h(
            ULink,
            {
              to: {
                name: "category",
                params: { id: encodeName(category) }
              },
              class: getTourColours(tours).hoverClass
            },
            () => category
          )
        }
      } else if (atp_category && wta_category) {
        return h("div", { class: "flex flex-col gap-1 items-center" }, [
          value === atp_category ?
            h("span", { class: "text-atp" }, atp_category)
          : h(
              ULink,
              {
                to: {
                  name: "category",
                  params: { id: encodeName(atp_category!) }
                },
                class: atpClass
              },
              () => atp_category
            ),
          value === wta_category ?
            h("span", { class: "text-wta" }, wta_category)
          : h(
              ULink,
              {
                to: {
                  name: "category",
                  params: { id: encodeName(wta_category!) }
                },
                class: wtaClass
              },
              () => wta_category
            )
        ])
      } else {
        return "—"
      }
    }
  },
  {
    accessorKey: "start_date",
    header: ({ column }) => {
      return h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Dates",
        icon:
          column.getIsSorted() ?
            column.getIsSorted() === "asc" ?
              icons.sortAlphaUp
            : icons.sortAlphaDown
          : icons.sortAlpha,
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      })
    },
    cell: ({ row }) =>
      row.original.dates ??
      h(
        "div",
        {
          class: "flex flex-col gap-1"
        },
        [h("span", { class: "text-atp" }, row.original.atp_dates!), h("span", { class: "text-wta" }, row.original.wta_dates!)]
      )
  },
  {
    id: "environment",
    accessorFn: row => row.surface?.environment ?? "—",
    header: ({ column }) => {
      return h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Environment",
        icon:
          column.getIsSorted() ?
            column.getIsSorted() === "asc" ?
              icons.sortAlphaUp
            : icons.sortAlphaDown
          : icons.sortAlpha,
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      })
    }
  },
  {
    id: "surface",
    accessorFn: row => row.surface?.surface ?? "Various",
    header: ({ column }) => {
      return h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Surface",
        icon:
          column.getIsSorted() ?
            column.getIsSorted() === "asc" ?
              icons.sortAlphaUp
            : icons.sortAlphaDown
          : icons.sortAlpha,
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      })
    },
    cell: ({ row }) => {
      const surface = row.original.surface
      if (surface) {
        if (value === surface.id) {
          return surface.surface
        } else {
          return h(
            ULink,
            {
              to: {
                name: "surface",
                params: { id: encodeName(surface.id) }
              },
              class: "hover-link"
            },
            () => row.getValue("surface")
          )
        }
      } else {
        return "Various"
      }
    }
  },
  {
    id: "country",
    accessorFn: row => row.venues?.[0]?.country?.name ?? "Various",
    header: ({ column }) => {
      return h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Country",
        icon:
          column.getIsSorted() ?
            column.getIsSorted() === "asc" ?
              icons.sortAlphaUp
            : icons.sortAlphaDown
          : icons.sortAlpha,
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      })
    },
    cell: ({ row }) =>
      row.original.venues.length ?
        h(
          ULink,
          {
            to: {
              name: "country",
              params: {
                id: row.original.venues[0].country.id,
                name: encodeName(row.original.venues[0].country.name)
              }
            }
          },
          () =>
            h(UIcon, {
              name: getFlagCode(row.original.venues[0].country),
              class: "text-xl"
            })
        )
      : "Various"
  }
]
</script>

<template>
  <u-table
    :data="events"
    :columns
    :loading="['pending', 'idle'].includes(status)"
    sticky
    class="max-h-200 min-h-150 md:min-h-165 xl:min-h-170 2xl:min-h-180 my-5 w-fit min-w-full xl:min-w-2/3 mx-auto"
  >
    <template #empty>
      {{
        name === "upcoming-tournaments" ? "No upcoming tournaments"
        : name === "category" ? `No events of category ${value} in ${query.year}`
        : name === "surface" ? `No events took place on ${value} in ${query.year}`
        : name === "venue" ? `No events took place at ${value} in ${query.year}`
        : `No events found in ${query.year}`
      }}
    </template>

    <template #expanded="{ row }">
      <div class="w-full flex flex-row-reverse justify-between gap-4 items-center">
        <!--Venues-->
        <div class="flex flex-col gap-1 items-end">
          <u-badge
            v-for="venue in row.original.venues"
            :key="venue.id"
            class="w-fit"
            :color="getTourColours(row.original.tours).cardColour"
          >
            <u-link
              v-if="params.id && decodeName(params.id as string) !== venue.id"
              :to="{ name: 'venue', params: { id: encodeName(venue.id) } }"
              :class="getTourColours(row.original.tours).hoverClass"
            >
              {{ venue.name ? `${venue.name}, ${venue.city}` : venue.city }}
            </u-link>
            <template v-else>{{ venue.name ? `${venue.name}, ${venue.city}` : venue.city }}</template>
          </u-badge>
        </div>

        <!--Sponsor name-->
        <u-badge
          v-if="row.original.name"
          :label="row.original.name"
          :color="getTourColours(row.original.tours).cardColour"
        />

        <!--Navigate to event pages-->
        <event-buttons
          :tournament="row.original.tournament"
          :year="row.original.year"
          :id="row.original.id"
          :start_date="row.original.start_date"
        />
      </div>
    </template>
  </u-table>
</template>
