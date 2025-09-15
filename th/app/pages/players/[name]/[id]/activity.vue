<script setup lang="ts">
import { FilterTableHeader, MatchScoreItem, NameTableHeader, PlayerLink, SortTableHeader, UButton, UIcon } from "#components"
import type { TableColumn } from "@nuxt/ui"
import {
  type Column,
  getFacetedRowModel,
  getFacetedMinMaxValues,
  getFacetedUniqueValues,
  getGroupedRowModel,
  type GroupingOptions
} from "@tanstack/vue-table"

definePageMeta({ name: "activity" })
const {
  params: { id, name }
} = useRoute("activity")
const {
  icons,
  ui: { icons: uIcons }
} = useAppConfig()
const playerYears = useState<number[]>("player-years")
const year = useRouteQuery<number>("year", playerYears.value?.length ? playerYears.value[playerYears.value.length - 1] : new Date().getFullYear())

// API call
const { data: yearActivity, status } = await useFetch<ActivityType>(() => `/api/players/activity`, {
  key: `player-activity-${year}`,
  query: { id, year },
  default: () => ({ stats: [], activity: [] }),
  server: false
})

const columns: TableColumn<ActivityInterface>[] = [
  {
    accessorKey: "tournament.name",
    filterFn: (row, columnId, filterValue) => filterIncludesString(row, columnId, filterValue),
    header: ({ column }) =>
      h(
        "div",
        {
          class: "flex items-center gap-1 w-fit"
        },
        [
          h(UButton, {
            icon: column.getIsGrouped() ? icons.ungroup : icons.group,
            size: "xs",
            variant: "link",
            color: "neutral",
            onClick: () => column.toggleGrouping()
          }),
          h(FilterTableHeader, {
            column: column as Column<unknown>,
            label: "Tournament",
            type: "alpha"
          })
        ]
      )
  },
  {
    accessorKey: "level",
    filterFn: (row, columnId, filterValue) => filterIncludesString(row, columnId, filterValue),
    header: ({ column }) =>
      h(
        "div",
        {
          class: "flex items-center gap-1 w-fit"
        },
        [
          h(UButton, {
            icon: column.getIsGrouped() ? icons.ungroup : icons.group,
            size: "xs",
            variant: "link",
            color: "neutral",
            onClick: () => column.toggleGrouping()
          }),
          h(FilterTableHeader, {
            column: column as Column<unknown>,
            label: "Level",
            type: "alpha"
          })
        ]
      )
  },
  {
    accessorKey: "category",
    filterFn: (row, columnId, filterValue) => filterIncludesString(row, columnId, filterValue),
    sortUndefined: "last",
    header: ({ column }) =>
      h(
        "div",
        {
          class: "flex items-center gap-1 w-fit"
        },
        [
          h(UButton, {
            icon: column.getIsGrouped() ? icons.ungroup : icons.group,
            size: "xs",
            variant: "link",
            color: "neutral",
            onClick: () => column.toggleGrouping()
          }),
          h(FilterTableHeader, {
            column: column as Column<unknown>,
            label: "Category",
            type: "alpha"
          })
        ]
      )
  },
  {
    id: "dates",
    accessorFn: row => `${row.start_date.year}-${row.start_date.month}-${row.start_date.day}`,
    header: ({ column }) => h(SortTableHeader, { column: column as Column<unknown>, label: "Dates", type: "alpha" }),
    cell: ({ row }) => {
      if (!row.getIsGrouped() || grouping.value.length === 0) {
        return dateTimeFormat.formatRange(getDate(row.original.start_date), getDate(row.original.end_date))
      }
    }
  },
  {
    accessorKey: "surface.id",
    filterFn: (row, columnId, filterValue) => filterIncludesString(row, columnId, filterValue),
    sortUndefined: "last",
    header: ({ column }) =>
      h(
        "div",
        {
          class: "flex items-center gap-1 w-fit"
        },
        [
          h(UButton, {
            icon: column.getIsGrouped() ? icons.ungroup : icons.group,
            size: "xs",
            variant: "link",
            color: "neutral",
            onClick: () => column.toggleGrouping()
          }),
          h(FilterTableHeader, {
            column: column as Column<unknown>,
            label: "Surface",
            type: "alpha"
          })
        ]
      )
  },
  {
    id: "country",
    accessorFn: row => row.venues[0]?.country.name,
    filterFn: (row, columnId, filterValue) => filterIncludesString(row, columnId, filterValue),
    header: ({ column }) =>
      h(
        "div",
        {
          class: "flex items-center gap-1 w-fit"
        },
        [
          h(UButton, {
            icon: column.getIsGrouped() ? icons.ungroup : icons.group,
            size: "xs",
            variant: "link",
            color: "neutral",
            onClick: () => column.toggleGrouping()
          }),
          h(FilterTableHeader, {
            column: column as Column<unknown>,
            label: "Country",
            type: "alpha"
          })
        ]
      )
  },
  {
    accessorKey: "type",
    filterFn: (row, columnId, filterValue) => filterIncludesString(row, columnId, filterValue),
    header: ({ column }) =>
      h(
        "div",
        {
          class: "flex items-center gap-1 w-fit"
        },
        [
          h(UButton, {
            icon: column.getIsGrouped() ? icons.ungroup : icons.group,
            size: "xs",
            variant: "link",
            color: "neutral",
            onClick: () => column.toggleGrouping()
          }),
          h(FilterTableHeader, {
            column: column as Column<unknown>,
            label: "S/D",
            type: "alpha"
          })
        ]
      )
  },
  {
    accessorKey: "match.draw",
    filterFn: (row, columnId, filterValue) => filterIncludesString(row, columnId, filterValue),
    header: ({ column }) =>
      h(
        "div",
        {
          class: "flex items-center gap-1 w-fit"
        },
        [
          h(UButton, {
            icon: column.getIsGrouped() ? icons.ungroup : icons.group,
            size: "xs",
            variant: "link",
            color: "neutral",
            onClick: () => column.toggleGrouping()
          }),
          h(FilterTableHeader, {
            column: column as Column<unknown>,
            label: "Draw",
            type: "alpha"
          })
        ]
      )
  },
  {
    accessorKey: "match.round",
    filterFn: (row, columnId, filterValue) => filterIncludesString(row, columnId, filterValue),
    header: ({ column }) =>
      h(
        "div",
        {
          class: "flex items-center gap-1 w-fit"
        },
        [
          h(UButton, {
            icon: column.getIsGrouped() ? icons.ungroup : icons.group,
            size: "xs",
            variant: "link",
            color: "neutral",
            onClick: () => column.toggleGrouping()
          }),
          h(FilterTableHeader, {
            column: column as Column<unknown>,
            label: "Round",
            type: "alpha"
          })
        ]
      )
  },
  {
    accessorKey: "player.rank",
    header: "Player Rank",
    aggregationFn: "min"
  },
  {
    id: "player_seed",
    accessorFn: row => (row.match.draw === "Main" ? row.player.seed : row.player.q_seed),
    header: "Player Seed",
    cell: ({ row, cell }) => {
      if (!row.getIsGrouped() || grouping.value.length === 0) {
        return cell.getValue()
      }
    }
  },
  {
    id: "player_status",
    accessorFn: row => (row.match.draw === "Main" ? row.player.status : row.player.q_status),
    header: "Player Status"
  },
  {
    accessorKey: "player.points",
    header: "Points",
    aggregationFn: "max"
  },
  {
    accessorKey: "player.pm",
    header: "Prize Money",
    cell: ({ row, cell }) => {
      if (!row.getIsGrouped() || grouping.value.length === 0) {
        return row.original.player.pm ?
            row.original.player.pm.toLocaleString("en-GB", { style: "currency", currency: row.original.currency })
          : undefined
      } else {
        return cell.getValue() ?
            (cell.getValue() as number).toLocaleString("en-GB", { style: "currency", currency: row.original.currency })
          : undefined
      }
    }
  },
  {
    id: "partner",
    accessorFn: row => (row.partner ? `${row.partner.last_name}, ${row.partner.first_name}` : undefined),
    sortUndefined: "last",
    filterFn: (row, columnId, filterValue) => filterIncludesString(row, columnId, filterValue),
    header: ({ column }) => h(FilterTableHeader, { column: column as Column<unknown>, label: "Partner", type: "alpha" }),
    cell: ({ row }) => {
      if ((!row.getIsGrouped() || grouping.value.length === 0) && row.original.partner) {
        return h(
          "div",
          {
            class: "flex items-center gap-1"
          },
          [
            h(PlayerLink, {
              player: row.original.partner
            }),
            h("span", {}, `[${row.original.partner.rank}]`)
          ]
        )
      }
    }
  },
  {
    id: "opponents",
    accessorFn: row => row.match.opponents.map(opponent => `${opponent.last_name}, ${opponent.first_name}`),
    filterFn: (row, columnId, filterValue) => filterIncludesName(row, columnId, filterValue),
    header: ({ column }) => h(NameTableHeader, { column: column as Column<unknown>, label: "Opponents" }),
    cell: ({ row }) => {
      if (!row.getIsGrouped() || grouping.value.length === 0) {
        return h(
          "div",
          {
            class: "flex flex-col items-center"
          },
          row.original.match.opponents.map(opponent =>
            h(PlayerLink, {
              player: opponent
            })
          )
        )
      }
    }
  },
  {
    id: "op_rank",
    accessorFn: row => row.match.opponents.map(opponent => opponent.rank),
    header: "Opponent Rank",
    cell: ({ row }) => {
      if (!row.getIsGrouped() || grouping.value.length === 0) {
        return h(
          "div",
          {
            class: "flex flex-col items-center"
          },
          row.original.match.opponents.map(opponent => h("span", {}, opponent.rank))
        )
      }
    }
  },
  {
    accessorKey: "match.winner_id",
    header: "",
    cell: ({ row }) => {
      if (!row.getIsGrouped() || grouping.value.length === 0) {
        if (
          row.original.match.opponents.map(opponent => opponent.id).includes(row.original.match.winner_id) ||
          row.original.match.incomplete === "B"
        ) {
          return h(UIcon, {
            name: uIcons.success,
            class: "text-success size-4"
          })
        } else {
          return h(UIcon, {
            name: uIcons.error,
            class: "text-error size-4"
          })
        }
      }
    }
  },
  {
    id: "score",
    header: "Score",
    cell: ({ row }) => {
      if (!row.getIsGrouped() || grouping.value.length === 0) {
        if (row.original.match.incomplete === "B") {
          return "BYE"
        } else {
          return h(MatchScoreItem, {
            draw: row.original.match.draw,
            tour: row.original.match.tour,
            type: row.original.match.type,
            match_no: row.original.match.match_no,
            sets: row.original.match.sets,
            tournament: row.original.tournament,
            year: year.value,
            incomplete: row.original.match.incomplete,
            stats: row.original.match.stats,
            centred: true,
            id: row.original.id
          })
        }
      }
    }
  },
  {
    id: "h2h",
    header: "",
    cell: ({ row }) => {
      if ((!row.getIsGrouped() || grouping.value.length === 0) && row.original.type !== "Doubles" && row.original.match.incomplete !== "B") {
        return h(UButton, {
          icon: icons.h2h,
          size: "xs",
          to: {
            name: "h2h-players",
            params: {
              p1Id: id,
              p2Id: row.original.match.opponents[0]?.id as string,
              p1Name: name,
              p2Name: kebabCase(`${row.original.match.opponents[0]?.first_name} ${row.original.match.opponents[0]?.last_name}`)
            }
          },
          label: "H2H"
        })
      }
    }
  }
]

const columnFilters = ref([])

const grouping = ref<string[]>([])

const grouping_options = ref<GroupingOptions>({
  getGroupedRowModel: getGroupedRowModel()
})

const table = useTemplateRef("table")
</script>

<template>
  <player-wrapper>
    <template #toolbar>
      <u-button
        label="Reset Sorting"
        :icon="icons.sortAlpha"
        @click="table?.tableApi.resetSorting()"
        size="sm"
      />
      <!--
      <u-radio-group
        v-model="selection"
        :items="['Titles', 'Finals']"
        orientation="horizontal"
      /> -->

      <u-button
        label="Reset Grouping"
        :icon="icons.ungroup"
        @click="table?.tableApi.resetGrouping()"
        size="sm"
      />
    </template>

    <div
      v-if="yearActivity.stats.length"
      class="flex items-center justify-around w-full"
    >
      <u-card
        v-if="yearActivity.stats.length"
        v-for="stat in yearActivity.stats"
        :key="stat.category"
        class="ring-primary"
        :ui="{ root: 'min-w-1/8', header: 'font-semibold text-muted p-1', body: 'text-center', footer: 'text-sm text-muted p-1' }"
      >
        <template #header>
          {{ stat.category }}
        </template>

        <div class="text-sm text-accented">
          {{ stat.value }}
        </div>

        <template #footer>
          {{ stat.type }}
        </template>
      </u-card>
    </div>

    <u-table
      ref="table"
      :data="yearActivity.activity"
      :columns
      :loading="['idle', 'pending'].includes(status)"
      sticky
      v-model:column-filters="columnFilters"
      :faceted-options="{
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedMinMaxValues: getFacetedMinMaxValues(),
        getFacetedUniqueValues: getFacetedUniqueValues()
      }"
      :grouping="grouping"
      v-on:update:grouping="grouping = $event"
      :grouping-options="grouping_options"
      :ui="{ root: 'w-fit min-w-1/3 mx-auto', tbody: '[&>tr]:cursor-pointer', td: 'empty:p-0' }"
    >
      <template #loading>
        <u-icon
          :name="uIcons.loading"
          class="size-8"
        />
      </template>

      <template #empty>
        <div class="flex justify-center items-center w-full gap-2 text-error">
          <u-icon
            :name="icons.noCalendar"
            class="text-base"
          />
          No events found
        </div>
      </template>

      <template #tournament_name-cell="{ row }">
        <div class="flex items-center gap-2">
          <u-button
            v-if="row.getIsGrouped() && grouping[0] === 'tournament_name'"
            :icon="uIcons.chevronDoubleRight"
            size="xs"
            variant="link"
            color="neutral"
            @click="row.toggleExpanded()"
            :ui="{ leadingIcon: row.getIsExpanded() ? 'rotate-90 transition-transform duration-200' : 'transition-transform duration-200' }"
          />
          <u-link
            v-if="
              (row.getIsGrouped() && grouping.includes('tournament_name') && row.depth === grouping.findIndex(x => x === 'tournament_name')) ||
              (!grouping.includes('tournament_name') && !row.getIsGrouped())
            "
            :to="{ name: 'tournament', params: { id: row.original.tournament.id, name: kebabCase(row.original.tournament.name) } }"
            class="hover-link default-link w-fit mx-auto"
          >
            {{ row.getValue("tournament_name") }}
          </u-link>
        </div>
      </template>

      <template #match_round-cell="{ row }">
        <div class="flex items-center gap-2">
          <u-button
            v-if="row.getIsGrouped() && grouping[0] === 'match_round'"
            :icon="uIcons.chevronDoubleRight"
            size="xs"
            variant="link"
            color="neutral"
            @click="row.toggleExpanded()"
            :ui="{ leadingIcon: row.getIsExpanded() ? 'rotate-90 transition-transform duration-200' : 'transition-transform duration-200' }"
          />
          <div
            v-if="
              (row.getIsGrouped() && grouping.includes('match_round') && row.depth === grouping.findIndex(x => x === 'match_round')) ||
              (!grouping.includes('match_round') && !row.getIsGrouped())
            "
            class="text-center"
          >
            {{ row.getValue("match_round") }}
          </div>
        </div>
      </template>

      <template #type-cell="{ row }">
        <div class="flex items-center gap-2">
          <u-button
            v-if="row.getIsGrouped() && grouping[0] === 'type'"
            :icon="uIcons.chevronDoubleRight"
            size="xs"
            variant="link"
            color="neutral"
            @click="row.toggleExpanded()"
            :ui="{ leadingIcon: row.getIsExpanded() ? 'rotate-90 transition-transform duration-200' : 'transition-transform duration-200' }"
          />
          <coloured-badge
            v-if="
              (row.getIsGrouped() && grouping.includes('type') && row.depth === grouping.findIndex(x => x === 'type')) ||
              (!grouping.includes('type') && !row.getIsGrouped())
            "
            :label="row.getValue('type')"
            class="mx-auto"
          />
        </div>
      </template>

      <template #match_draw-cell="{ row }">
        <div class="flex items-center gap-2">
          <u-button
            v-if="row.getIsGrouped() && grouping[0] === 'match_draw'"
            :icon="uIcons.chevronDoubleRight"
            size="xs"
            variant="link"
            color="neutral"
            @click="row.toggleExpanded()"
            :ui="{ leadingIcon: row.getIsExpanded() ? 'rotate-90 transition-transform duration-200' : 'transition-transform duration-200' }"
          />
          <coloured-badge
            v-if="
              (row.getIsGrouped() && grouping.includes('match_draw') && row.depth === grouping.findIndex(x => x === 'match_draw')) ||
              (!grouping.includes('match_draw') && !row.getIsGrouped())
            "
            :label="row.getValue('match_draw')"
            class="mx-auto"
          />
        </div>
      </template>

      <template #level-cell="{ row }">
        <div class="flex items-center gap-2">
          <u-button
            v-if="row.getIsGrouped() && grouping[0] === 'level'"
            :icon="uIcons.chevronDoubleRight"
            size="xs"
            variant="link"
            color="neutral"
            @click="row.toggleExpanded()"
            :ui="{ leadingIcon: row.getIsExpanded() ? 'rotate-90 transition-transform duration-200' : 'transition-transform duration-200' }"
          />
          <coloured-badge
            v-if="
              (row.getIsGrouped() && grouping.includes('level') && row.depth === grouping.findIndex(x => x === 'level')) ||
              (!grouping.includes('level') && !row.getIsGrouped())
            "
            :label="row.getValue('level')"
            class="mx-auto"
          />
        </div>
      </template>

      <template #category-cell="{ row }">
        <div class="flex items-center gap-2">
          <u-button
            v-if="row.getIsGrouped() && grouping[0] === 'category'"
            :icon="uIcons.chevronDoubleRight"
            size="xs"
            variant="link"
            color="neutral"
            @click="row.toggleExpanded()"
            :ui="{ leadingIcon: row.getIsExpanded() ? 'rotate-90 transition-transform duration-200' : 'transition-transform duration-200' }"
          />
          <u-link
            v-if="
              (row.getIsGrouped() && grouping.includes('category') && row.depth === grouping.findIndex(x => x === 'category')) ||
              (!grouping.includes('category') && !row.getIsGrouped())
            "
            :to="{ name: 'category', params: { id: kebabCase(row.getValue('category') as string) } }"
            class="hover-link default-link w-fit mx-auto"
          >
            {{ row.getValue("category") }}
          </u-link>
        </div>
      </template>

      <template #surface_id-cell="{ row }">
        <div class="flex items-center gap-2">
          <u-button
            v-if="row.getIsGrouped() && grouping[0] === 'surface_id'"
            :icon="uIcons.chevronDoubleRight"
            size="xs"
            variant="link"
            color="neutral"
            @click="row.toggleExpanded()"
            :ui="{ leadingIcon: row.getIsExpanded() ? 'rotate-90 transition-transform duration-200' : 'transition-transform duration-200' }"
          />
          <u-link
            v-if="
              (row.getIsGrouped() && grouping.includes('surface_id') && row.depth === grouping.findIndex(x => x === 'surface_id')) ||
              (!grouping.includes('surface_id') && !row.getIsGrouped())
            "
            :to="{ name: 'surface', params: { id: kebabCase(row.getValue('surface_id') as string) } }"
            class="hover-link default-link w-fit mx-auto"
          >
            {{ row.getValue("surface_id") }}
          </u-link>
        </div>
      </template>

      <template #country-cell="{ row }">
        <div class="flex items-center gap-2">
          <u-button
            v-if="row.getIsGrouped() && grouping[0] === 'country'"
            :icon="uIcons.chevronDoubleRight"
            size="xs"
            variant="link"
            color="neutral"
            @click="row.toggleExpanded()"
            :ui="{ leadingIcon: row.getIsExpanded() ? 'rotate-90 transition-transform duration-200' : 'transition-transform duration-200' }"
          />
          <country-link
            v-if="
              (row.getIsGrouped() && grouping.includes('country') && row.depth === grouping.findIndex(x => x === 'country')) ||
              (!grouping.includes('country') && !row.getIsGrouped())
            "
            :country="row.original.venues[0]!.country"
            class="mx-auto"
          />
        </div>
      </template>
    </u-table>
  </player-wrapper>
</template>
