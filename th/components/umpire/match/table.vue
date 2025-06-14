<script setup lang="ts">
import { UIcon, ULink } from "#components"
import type { TableColumn } from "@nuxt/ui"
import { getGroupedRowModel, type GroupingOptions } from "@tanstack/vue-table"

type newEventType = Pick<
  EventInterface,
  "id" | "tournament" | "year" | "surface" | "category" | "venues" | "dates" | "tours" | "atp_dates" | "wta_dates" | "atp_category" | "wta_category"
> & {
  round: RoundType
} & Pick<MatchInterface, "match_no" | "p1" | "p2" | "date" | "type">

const { events, status } = defineProps<{
  events: APIUmpireEventType[]
  status: APIStatusType
}>()
const appConfig = useAppConfig()
const route = useRoute()
const name = computed(() => decodeName(route.params.id as string))

// Flatten the events array
const formattedEvents = computed(() =>
  events.flatMap(event =>
    event.rounds.flatMap(round =>
      round.matches.map(match => ({
        id: event.id,
        tournament: event.tournament,
        year: event.year,
        surface: event.surface,
        category: event.category,
        venues: event.venues,
        dates: event.dates,
        tours: event.tours,
        atp_dates: event.atp_dates,
        wta_dates: event.wta_dates,
        atp_category: event.atp_category,
        wta_category: event.wta_category,
        type: match.type,
        round: round.round,
        match_no: match.match_no,
        p1: match.p1,
        p2: match.p2,
        date: match.date
      }))
    )
  )
)

const columns: TableColumn<newEventType>[] = [
  { id: "expand", header: "Tournament", meta: { class: { th: "text-left" } } },
  { id: "tournament", accessorKey: "tournament.name" },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      if (row.getIsGrouped() && row.depth === 0) {
        if (row.original.category) {
          return h(
            ULink,
            {
              to: {
                name: "category",
                params: { id: encodeName(row.original.category) }
              },
              class: getTourColours(row.original.tours).hoverClass
            },
            () => row.original.category
          )
        } else if (row.original.atp_category && row.original.wta_category) {
          return h("div", { class: "flex flex-col gap-1" }, [
            h(
              ULink,
              {
                to: {
                  name: "category",
                  params: { id: encodeName(row.original.atp_category) }
                },
                class: atpClass + " w-fit mx-auto"
              },
              () => row.original.atp_category
            ),
            h(
              ULink,
              {
                to: {
                  name: "category",
                  params: { id: encodeName(row.original.wta_category) }
                },
                class: wtaClass + " w-fit mx-auto"
              },
              () => row.original.wta_category
            )
          ])
        }
      }
    }
  },
  {
    id: "surface",
    header: "Surface",
    cell: ({ row }) => {
      if (row.getIsGrouped() && row.depth === 0)
        return h(
          ULink,
          {
            to: {
              name: "surface",
              params: { id: encodeName(row.original.surface.id) }
            },
            class: "hover-link"
          },
          () => row.original.surface.id
        )
    }
  },
  {
    id: "country",
    header: "Country",
    cell: ({ row }) => {
      if (row.getIsGrouped() && row.depth === 0)
        return h(
          ULink,
          {
            to: {
              name: "country",
              params: { id: row.original.venues[0].country.id, name: encodeName(row.original.venues[0].country.name) }
            }
          },
          () =>
            h(UIcon, {
              name: getFlagCode(row.original.venues[0].country),
              class: "text-xl"
            })
        )
    }
  },
  { accessorKey: "round", header: "Round" },
  { accessorKey: "dates", header: "Dates" },
  { accessorKey: "match_no", header: "Match", aggregationFn: "count" }
]

const grouping_options = ref<GroupingOptions>({
  groupedColumnMode: "remove",
  getGroupedRowModel: getGroupedRowModel()
})

const getMID = (match_no: number, match_type: string[]) => {
  const genderPrefix = match_type.includes("WTA") || match_type.includes("Women") ? "l" : "m"
  const typePrefix = match_type.includes("Singles") ? "s" : "d"
  const drawTypePrefix = match_type.includes("Main") ? "m" : "q"
  const suffix =
    match_no < 10 ? `00${match_no}`
    : match_no < 100 ? `0${match_no}`
    : match_no
  return `${drawTypePrefix}${genderPrefix}${typePrefix}${suffix}`
}
</script>

<template>
  <u-table
    :data="formattedEvents"
    :columns
    :loading="['pending', 'idle'].includes(status)"
    sticky
    :grouping="['tournament', 'round']"
    :grouping-options="grouping_options"
    :ui="{
      root: 'max-h-200 min-w-full',
      td: 'empty:p-0' // helps with the colspaned row added for expand slot
    }"
    :empty="`No matches umpired by ${name}`"
  >
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
        <u-link
          v-if="row.groupingColumnId === 'tournament'"
          :to="{
            name: 'tournament',
            params: {
              id: row.original.tournament.id,
              name: encodeName(row.original.tournament.name)
            }
          }"
          class="hover-link"
        >
          {{ row.original.tournament.name }}
        </u-link>
        <div
          v-else-if="row.groupingColumnId === 'round'"
          class="font-semibold"
        >
          {{ row.original.round }}
        </div>
      </div>
    </template>

    <template #dates-cell="{ row }">
      <template v-if="row.depth === 0">
        <template v-if="row.original.dates">{{ row.original.dates }}</template>
        <div
          v-else
          class="flex flex-col gap-1"
        >
          <span class="text-atp">{{ row.original.atp_dates }}</span>
          <span class="text-wta">{{ row.original.wta_dates }}</span>
        </div>
      </template>
      <template v-else-if="!row.getIsGrouped() && row.original.date">{{ row.original.date }}</template>
    </template>

    <template #match_no-cell="{ row }">
      <template v-if="row.getIsGrouped()">{{ row.getValue("match_no") }} {{ row.getValue("match_no") === 1 ? "match" : "matches" }}</template>
      <u-link
        v-else
        :to="{
          name: 'match',
          params: {
            id: row.original.tournament.id,
            name: encodeName(row.original.tournament.name),
            year: row.original.year,
            eid: row.original.id,
            mid: getMID(row.original.match_no, row.original.type)
          }
        }"
      >
        <div class="flex items-center gap-2">
          <u-icon
            :name="getFlagCode(row.original.p1.country)"
            class="text-xl"
          />
          <span>{{ row.original.p1.name }}</span>
          v.
          <u-icon
            :name="getFlagCode(row.original.p2.country)"
            class="text-xl"
          />
          <span>{{ row.original.p2.name }}</span>
        </div>
      </u-link>
    </template>
  </u-table>
</template>
