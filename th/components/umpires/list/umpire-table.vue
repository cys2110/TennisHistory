<script setup lang="ts">
import { BaseLink, UButton, UIcon, UUser } from "#components"
import type { TableColumn } from "@nuxt/ui"
import { getGroupedRowModel, type GroupingOptions } from "@tanstack/vue-table"

type EventType = Pick<EventInterface, "id" | "tournament" | "draw_type" | "year" | "surface" | "category" | "venues" | "dates"> & {
  rounds: {
    round: RoundType
    matches: Pick<MatchInterface, "match_no" | "p1" | "p2" | "date">[]
  }[]
}

type newEventType = Pick<EventInterface, "id" | "tournament" | "draw_type" | "year" | "surface" | "category" | "venues" | "dates"> & {
  round: RoundType
} & Pick<MatchInterface, "match_no" | "p1" | "p2" | "date">

const { events, count, status } = defineProps<{
  events: EventType[]
  status: APIStatusType
  count: number
}>()
const appConfig = useAppConfig()

const formattedEvents = computed(() => {
  const newArray: newEventType[] = []
  events.forEach(event => {
    event.rounds.forEach(round => {
      round.matches.forEach(match => {
        newArray.push({
          id: event.id,
          tournament: event.tournament,
          draw_type: event.draw_type,
          year: event.year,
          surface: event.surface,
          venues: event.venues,
          dates: event.dates,
          round: round.round,
          match_no: match.match_no,
          p1: match.p1,
          p2: match.p2,
          category: event.category,
          date: match.date
        })
      })
    })
  })
  return newArray
})

const skip = defineModel<number>({ default: 0 })
const tournamentSort = defineModel<"ASC" | "DESC" | undefined>("tournament-sort", { default: undefined })
const categorySort = defineModel<"ASC" | "DESC" | undefined>("category-sort", { default: undefined })
const dateSort = defineModel<"ASC" | "DESC" | undefined>("date-sort", { default: "ASC" })
const surfaceSort = defineModel<"ASC" | "DESC" | undefined>("surface-sort", { default: undefined })

const table = useTemplateRef<ComponentPublicInstance>("table")

onMounted(async () => {
  useInfiniteScroll(
    table.value?.$el,
    () => {
      skip.value += 25
    },
    {
      distance: 150,
      canLoadMore: () => status !== "pending" && events.length < count
    }
  )
})

const columns: TableColumn<newEventType>[] = [
  {
    id: "expand",
    header: () =>
      h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Tournament",
        icon: tournamentSort.value ? (tournamentSort.value === "ASC" ? ICONS.sortAlphaUp : ICONS.sortAlphaDown) : ICONS.sortAlpha,
        onClick: () => {
          categorySort.value = undefined
          dateSort.value = undefined
          surfaceSort.value = undefined
          tournamentSort.value = tournamentSort.value === "ASC" ? "DESC" : "ASC"
        },
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      })
  },
  {
    id: "tournament",
    accessorKey: "tournament.name"
  },
  {
    accessorKey: "category",
    header: () =>
      h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Category",
        icon: categorySort.value ? (categorySort.value === "ASC" ? ICONS.sortAlphaUp : ICONS.sortAlphaDown) : ICONS.sortAlpha,
        onClick: () => {
          tournamentSort.value = undefined
          dateSort.value = undefined
          surfaceSort.value = undefined
          categorySort.value = categorySort.value === "ASC" ? "DESC" : "ASC"
        },
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      }),
    cell: ({ row }) => {
      if (row.getIsGrouped() && row.depth === 0) {
        return h(BaseLink, {
          type: "category",
          id: row.original.category ?? ""
        })
      }
    }
  },
  {
    accessorKey: "dates",
    header: () =>
      h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Dates",
        icon: dateSort.value ? (dateSort.value === "ASC" ? ICONS.sortAlphaUp : ICONS.sortAlphaDown) : ICONS.sortAlpha,
        onClick: () => {
          categorySort.value = undefined
          tournamentSort.value = undefined
          surfaceSort.value = undefined
          dateSort.value = dateSort.value === "ASC" ? "DESC" : "ASC"
        },
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      }),
    cell: ({ row }) => {
      if (row.getIsGrouped() && row.depth === 0) {
        return row.original.dates
      } else if (!row.getIsGrouped()) {
        return row.original.date
      }
    }
  },
  {
    id: "surface",
    header: () =>
      h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Surface",
        icon: surfaceSort.value ? (surfaceSort.value === "ASC" ? ICONS.sortAlphaUp : ICONS.sortAlphaDown) : ICONS.sortAlpha,
        onClick: () => {
          categorySort.value = undefined
          dateSort.value = undefined
          tournamentSort.value = undefined
          surfaceSort.value = surfaceSort.value === "ASC" ? "DESC" : "ASC"
        },
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      }),
    cell: ({ row }) => {
      if (row.getIsGrouped() && row.depth === 0) {
        return h(BaseLink, {
          type: "surface",
          id: row.original.surface.id
        })
      }
    }
  },
  {
    id: "Country",
    header: "Country",
    cell: ({ row }) => {
      if (row.getIsGrouped() && row.depth === 0) {
        return h(BaseLink, {
          type: "country",
          country: row.original.venues[0].country,
          class: "mx-auto"
        })
      }
    }
  },
  {
    accessorKey: "round",
    header: "Round"
  },
  {
    accessorKey: "match_no",
    header: "Match",
    cell: ({ row }) => {
      if (row.getIsGrouped()) {
        return `${row.getValue("match_no")} matches`
      } else {
        return h(
          BaseLink,
          {
            type: "match",
            id: row.original.id,
            tournament: row.original.tournament,
            year: row.original.year,
            match_no: row.original.match_no
          },
          () =>
            h(
              "div",
              {
                class: "flex items-center gap-2"
              },
              [
                h(UIcon, {
                  name: row.original.p1.country.alpha2 ? `flag:${row.original.p1.country.alpha2}-4x3` : `flags:${row.original.p1.country.id}`
                }),
                h(UUser, {
                  avatar: {
                    src: `https://www.atptour.com/-/media/alias/player-headshot/${row.original.p1.id}`,
                    icon: ICONS.player
                  },
                  name: row.original.p1.name,
                  size: "sm"
                }),
                " v. ",
                h(UIcon, {
                  name: row.original.p2.country.alpha2 ? `flag:${row.original.p2.country.alpha2}-4x3` : `flags:${row.original.p2.country.id}`
                }),
                h(UUser, {
                  avatar: {
                    src: `https://www.atptour.com/-/media/alias/player-headshot/${row.original.p2.id}`,
                    icon: ICONS.player
                  },
                  name: row.original.p2.name,
                  size: "sm"
                })
              ]
            )
        )
      }
    },
    aggregationFn: "count"
  }
]

const grouping_options = ref<GroupingOptions>({
  groupedColumnMode: "remove",
  getGroupedRowModel: getGroupedRowModel()
})
</script>

<template>
  <u-table
    ref="table"
    :data="formattedEvents"
    :columns
    class="max-h-200"
    :loading="['pending', 'idle'].includes(status)"
    sticky
    :grouping="['tournament', 'round']"
    :grouping-options="grouping_options"
    :ui="{
      root: 'min-w-full',
      td: 'empty:p-0' // helps with the colspaned row added for expand slot
    }"
  >
    <template #loading>
      <div
        v-for="_ in 6"
        :key="_"
        class="flex w-full gap-8"
      >
        <u-skeleton class="h-4 w-full rounded-lg" />
      </div>
    </template>
    <template #empty> No matches found </template>

    <template #expand-cell="{ row }">
      <div
        v-if="row.getIsGrouped()"
        class="flex items-center"
      >
        <span
          class="inline-block"
          :style="{ width: `calc(${row.depth} * 1rem)` }"
        />

        <u-button
          variant="link"
          color="neutral"
          class="mr-2"
          size="xs"
          :icon="row.getIsExpanded() ? appConfig.ui.icons.minus : appConfig.ui.icons.plus"
          @click="row.toggleExpanded()"
        />
        <base-link
          v-if="row.groupingColumnId === 'tournament'"
          type="tournament"
          :tournament="row.original.tournament"
          class="font-bold"
        />
        <div
          v-else-if="row.groupingColumnId === 'round'"
          class="font-semibold"
        >
          {{ row.original.round }}
        </div>
      </div>
    </template>
  </u-table>
</template>
