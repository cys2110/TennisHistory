<script setup lang="ts">
import { CountryLink, EventButtons, MatchScoreItem, PlayerLink, UBadge, UButton } from "#components"
import type { TableColumn } from "@nuxt/ui"
import { getGroupedRowModel, type GroupingOptions } from "@tanstack/vue-table"

const { events } = defineProps<{ events: TournamentWinnerType[]; status: APIStatusType }>()
const {
  ui: { icons }
} = useAppConfig()
const route = useRoute()
const name = computed(() => decodeName(route.params.name as string))

interface newEventType {
  id: number
  year: number
  winner: TournamentWinnerPlayerType | TournamentWinnerPlayerType[] | CountryInterface | null
  loser: TournamentWinnerPlayerType | TournamentWinnerPlayerType[] | CountryInterface | null
  sets: string[]
  tbs: (string | null)[]
  incomplete: IncompleteType | null
  type: "Singles" | "Doubles" | null
  tour: TourType | TourType[]
  score?: string
}

const isPlayerType = (player: any) => {
  return "country" in player
}

const formattedEvents = computed(() => {
  const keys = ["ms", "md", "ls", "ld"]
  const newArray: newEventType[] = []
  const noFinal = {
    winner: null,
    loser: null,
    sets: [],
    tbs: [],
    incomplete: null
  }
  events.forEach(event => {
    type EventKey = "ms" | "md" | "ls" | "ld"
    keys.forEach(key => {
      const k = key as EventKey
      if (event[k]) {
        const newEvent: newEventType = {
          id: event.id,
          year: event.year,
          tour: k === "ms" || k === "md" ? "ATP" : "WTA",
          type: k === "ms" || k === "ls" ? "Singles" : "Doubles",
          ...noFinal
        }
        if (typeof event[k] !== "string") {
          newEvent.winner = event[k].winner
          newEvent.loser = event[k].loser
          newEvent.sets = event[k].sets
          newEvent.tbs = event[k].tbs
          newEvent.incomplete = event[k].incomplete
        }
        newArray.push(newEvent)
      }
    })
    if (event.country) {
      const score = event.country.score.split("-").map((s: string) => Number(s))
      newArray.push({
        id: event.id,
        year: event.year,
        tour: event.tours,
        type: null,
        winner: score[0] > score[1] ? event.country.c1 : event.country.c2,
        loser: score[0] > score[1] ? event.country.c2 : event.country.c1,
        sets: [],
        tbs: [],
        incomplete: null,
        score: Math.max(score[0], score[1]) + "-" + Math.min(score[0], score[1])
      })
    }
  })
  return newArray.sort((a, b) => a.year - b.year)
})

const columns = ref<TableColumn<newEventType>[]>([
  {
    accessorKey: "year",
    header: "Year",
    cell: ({ row }) => {
      if (row.getIsGrouped()) {
        return h(
          UButton,
          {
            variant: "link",
            color: "neutral",
            class: "mr-2",
            icon: row.getIsExpanded() ? icons.minus : icons.plus,
            onClick: () => row.toggleExpanded()
          },
          () => row.original.year
        )
      }
    }
  },
  {
    id: "tour",
    header: "Tour",
    cell: ({ row }) => {
      if (!row.getIsGrouped()) {
        if (Array.isArray(row.original.tour)) {
          return h(
            "div",
            {
              class: "flex items-center gap-2"
            },
            row.original.tour.map(tour =>
              h(UBadge, {
                variant: "outline",
                label: tour,
                color:
                  tour === "ATP" ? "atp"
                  : tour === "WTA" ? "wta"
                  : tour === "Men" ? "men"
                  : "women"
              })
            )
          )
        } else {
          return h(UBadge, {
            variant: "outline",
            label: row.original.tour,
            color:
              row.original.tour === "ATP" ? "atp"
              : row.original.tour === "WTA" ? "wta"
              : row.original.tour === "Men" ? "men"
              : "women"
          })
        }
      }
    }
  },
  {
    id: "singles",
    header: "Singles/Doubles",
    cell: ({ row }) => {
      if (!row.getIsGrouped() && row.original.type) {
        return h(UBadge, {
          variant: "outline",
          label: row.original.type,
          color: row.original.type === "Singles" ? "singles" : "doubles"
        })
      }
    }
  },
  {
    id: "Winner",
    header: "Winner",
    cell: ({ row }) => {
      if (!row.getIsGrouped()) {
        if (row.original.winner) {
          if (Array.isArray(row.original.winner)) {
            return h(
              "div",
              {
                class: "flex items-center gap-2"
              },
              [
                h(PlayerLink, {
                  player: row.original.winner[0],
                  class: "mx-auto w-fit"
                }),
                h("span", {}, "/"),
                h(PlayerLink, {
                  player: row.original.winner[1],
                  class: "mx-auto w-fit"
                })
              ]
            )
          } else if (isPlayerType(row.original.winner)) {
            return h(PlayerLink, {
              player: row.original.winner as Pick<PlayerInterface, "id" | "name" | "last_name" | "country">,
              class: "mx-auto w-fit"
            })
          } else {
            return h(CountryLink, {
              type: "country",
              country: row.original.winner as CountryInterface,
              class: "mx-auto w-fit"
            })
          }
        } else {
          return "No final played"
        }
      }
    }
  },
  {
    id: "Finalist",
    header: "Finalist",
    cell: ({ row }) => {
      if (!row.getIsGrouped()) {
        if (row.original.loser) {
          if (Array.isArray(row.original.loser)) {
            return h(
              "div",
              {
                class: "flex items-center gap-2"
              },
              [
                h(PlayerLink, {
                  player: row.original.loser[0],
                  class: "mx-auto w-fit"
                }),
                h("span", {}, "/"),
                h(PlayerLink, {
                  player: row.original.loser[1],
                  class: "mx-auto w-fit"
                })
              ]
            )
          } else if (isPlayerType(row.original.loser)) {
            return h(PlayerLink, {
              player: row.original.loser as Pick<PlayerInterface, "id" | "name" | "last_name" | "country">,
              class: "mx-auto w-fit"
            })
          } else {
            return h(CountryLink, {
              type: "country",
              country: row.original.loser as CountryInterface,
              class: "mx-auto w-fit"
            })
          }
        }
      }
    }
  },
  {
    id: "score",
    header: "Score",
    cell: ({ row }) => {
      if (!row.getIsGrouped()) {
        if (!row.original.score) {
          return h(MatchScoreItem, {
            sets: row.original.sets,
            tbs: row.original.tbs,
            tournament: { name: route.params.name as string, id: Number(route.params.id as string) },
            year: row.original.year.toString(),
            id: row.original.id,
            match_no: 1,
            incomplete: row.original.incomplete,
            type: row.original.type as "Singles" | "Doubles",
            tour: row.original.tour as "ATP" | "WTA",
            round: "Final",
            class: "mx-auto w-fit"
          })
        } else {
          return row.original.score
        }
      }
    }
  },
  {
    id: "navigation",
    cell: ({ row }) => {
      if (row.getIsGrouped())
        return h(EventButtons, {
          tournament: { id: Number(route.params.id as string), name: route.params.name as string },
          year: row.original.year,
          id: row.original.id
        })
    }
  }
])

const grouping_options = ref<GroupingOptions>({
  groupedColumnMode: false,
  getGroupedRowModel: getGroupedRowModel()
})
</script>

<template>
  <u-table
    :data="formattedEvents"
    :columns
    :loading="['pending', 'idle'].includes(status)"
    sticky
    :grouping="['year']"
    :grouping-options="grouping_options"
    :ui="{
      root: 'max-h-160 max-w-full min-w-full mx-auto',
      td: 'empty:p-0' // helps with the colspaned row added for expand slot
    }"
  >
    <template #empty> No events found for {{ name }}</template>
  </u-table>
</template>
