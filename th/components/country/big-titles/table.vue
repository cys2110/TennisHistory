<script setup lang="ts">
import { UBadge, UButton, ULink } from "#components"
import type { TableColumn } from "@nuxt/ui"
import { getGroupedRowModel, type GroupingOptions } from "@tanstack/vue-table"

const { players, status } = defineProps<{
  players: { singles_players: CountryBigTitlesAPIResponseType[]; doubles_players: CountryBigTitlesAPIResponseType[] }
  status: APIStatusType
}>()

const appConfig = useAppConfig()
const route = useRoute()
const name = computed(() => route.params.name as string)

type ColumnType = Pick<PlayerInterface, "name" | "country" | "max_year" | "last_name"> &
  Pick<EventInterface, "tournament" | "year" | "category" | "atp_category" | "wta_category"> & {
    player_id: string
    event_id: number
    level: "Grand Slam" | "1000 Level" | "Olympics" | "Finals"
    type: "Singles" | "Doubles"
    player_tour: TourType
    event_tours: TourType[]
  }

const currentYear = new Date().getFullYear()

const formattedPlayers = computed(() => {
  const mapEvents = (players: CountryBigTitlesAPIResponseType[], type: "Singles" | "Doubles") =>
    players.flatMap(player => {
      return ["gs", "a1000", "olympics", "finals"].flatMap(key => {
        const labelMap = {
          gs: "Grand Slam",
          a1000: "1000 Level",
          olympics: "Olympics",
          finals: "Finals"
        }
        return player[key as "gs" | "a1000" | "olympics" | "finals"].map(
          (event): ColumnType => ({
            player_id: player.id,
            name: player.name,
            last_name: player.last_name,
            country: player.country,
            max_year: player.max_year,
            player_tour: player.tour,
            tournament: event.tournament,
            event_id: event.id,
            year: event.year,
            category: event.category,
            atp_category: event.atp_category,
            wta_category: event.wta_category,
            event_tours: event.tours,
            level: labelMap[key as keyof typeof labelMap] as "Grand Slam" | "1000 Level" | "Olympics" | "Finals",
            type
          })
        )
      })
    })

  return [...mapEvents(players.singles_players, "Singles"), ...mapEvents(players.doubles_players, "Doubles")].sort((a, b) =>
    a.last_name.localeCompare(b.last_name)
  )
})

const getLevelColour = (level: "Grand Slam" | "1000 Level" | "Olympics" | "Finals") => {
  switch (level) {
    case "Grand Slam":
      return "active"
    case "1000 Level":
      return "women"
    case "Olympics":
      return "doubles"
    case "Finals":
      return "singles"
  }
}

const columns: TableColumn<ColumnType>[] = [
  { id: "expand", header: "Players" },
  { id: "player", accessorKey: "player_id" },
  {
    id: "tour",
    header: "Tour",
    cell: ({ row }) => {
      if (row.getIsGrouped() && row.depth === 0) {
        return h(UBadge, {
          label: row.original.player_tour,
          color: row.original.player_tour.toLowerCase() as "atp" | "wta"
        })
      }
    }
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      if (row.getIsGrouped() && row.depth === 0)
        return h(UBadge, {
          color: row.original.max_year === currentYear ? "active" : "inactive",
          label: row.original.max_year === currentYear ? "Active" : "Inactive",
          class: "mx-auto w-fit"
        })
    }
  },
  { accessorKey: "level" },
  {
    accessorKey: "event_id",
    header: "Tournament",
    aggregationFn: "uniqueCount",
    cell: ({ row }) => {
      const { tournament } = row.original
      if (!row.getIsGrouped()) {
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
      } else {
        const count = row.getValue("event_id")
        return `${count} ${count === 1 ? "tournament" : "tournaments"}`
      }
    }
  },
  {
    accessorKey: "year",
    header: "Year",
    aggregationFn: "uniqueCount",
    cell: ({ row }) => {
      const { event_id, tournament, year } = row.original
      if (!row.getIsGrouped()) {
        return h(
          ULink,
          {
            to: {
              name: "event",
              params: {
                id: tournament.id,
                name: encodeName(tournament.name),
                year,
                eid: event_id
              }
            },
            class: "hover-link"
          },
          () => year
        )
      } else {
        const years = row.getValue("year")
        return `${years} ${years === 1 ? "year" : "years"}`
      }
    }
  },
  {
    accessorKey: "type",
    header: "Singles/Doubles",
    cell: ({ row }) => {
      if (!row.getIsGrouped()) {
        return h(UBadge, {
          label: row.original.type,
          color: row.original.type === "Singles" ? "singles" : "doubles"
        })
      } else {
        const directRows = row.getLeafRows() ?? []
        let singlesCount = 0
        let doublesCount = 0
        for (const r of directRows) {
          if (r.depth === 2) {
            if (r.original.type === "Singles") singlesCount++
            else if (r.original.type === "Doubles") doublesCount++
          }
        }
        return h(
          "div",
          { class: "flex gap-2" },
          [
            singlesCount &&
              h(UBadge, {
                label: `Singles: ${singlesCount}`,
                color: "singles"
              }),
            doublesCount &&
              h(UBadge, {
                label: `Doubles: ${doublesCount}`,
                color: "doubles"
              })
          ].filter(Boolean)
        )
      }
    }
  },
  {
    id: "category",
    header: "Category",
    cell: ({ row }) => {
      if (row.getIsGrouped()) {
        const directRows = row.subRows ?? []
        const categorySet = new Set<string>()

        for (const r of directRows) {
          if (r.original.category) categorySet.add(r.original.category)
          if (r.original.atp_category && r.original.player_tour === "ATP") categorySet.add(r.original.atp_category)
          if (r.original.wta_category && r.original.player_tour === "WTA") categorySet.add(r.original.wta_category)
        }

        return `${categorySet.size} ${categorySet.size === 1 ? "category" : "categories"}`
      }
    }
  }
]

const grouping_options = ref<GroupingOptions>({
  groupedColumnMode: "remove",
  getGroupedRowModel: getGroupedRowModel()
})
</script>

<template>
  <u-table
    :data="formattedPlayers"
    :columns
    :loading="['pending', 'idle'].includes(status)"
    sticky
    :grouping="['player', 'level']"
    :grouping-options="grouping_options"
    :ui="{
      root: 'max-h-160 max-w-full min-w-full md:min-w-3/4 xl:min-w-1/2 mx-auto mt-5',
      td: 'empty:p-0' // helps with the colspaned row added for expand slot
    }"
    :empty="`No players who have won big titles representing ${name}`"
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
        <div
          v-if="row.groupingColumnId === 'player'"
          class="flex items-center gap-2"
        >
          <u-link
            :to="{
              name: 'country',
              params: { id: row.original.country.id, name: encodeName(row.original.country.name) }
            }"
            class="text-xl flex items-center"
          >
            <u-icon :name="getFlagCode(row.original.country)" />
          </u-link>
          <u-link
            :to="{
              name: 'player',
              params: {
                id: row.original.player_id,
                name: encodeName(row.original.name)
              }
            }"
            class="font-bold hover-link"
          >
            {{ row.original.name }}
          </u-link>
        </div>
        <u-badge
          v-else-if="row.groupingColumnId === 'level'"
          class="font-semibold"
          :label="row.original.level"
          :color="getLevelColour(row.original.level)"
        />
      </div>
    </template>

    <template #category-cell="{ row }">
      <div v-if="!row.getIsGrouped()">
        <u-link
          v-if="row.original.category"
          :to="{
            name: 'category',
            params: { id: encodeName(row.original.category) }
          }"
          :class="getTourColours(row.original.event_tours).hoverClass"
        >
          {{ row.original.category }}
        </u-link>
        <div
          v-else-if="row.original.atp_category && row.original.wta_category"
          class="flex flex-col gap-1"
        >
          <u-link
            :to="{
              name: 'category',
              params: { id: encodeName(row.original.atp_category) }
            }"
            :class="atpClass"
          >
            {{ row.original.atp_category }}
          </u-link>
          <u-link
            :to="{
              name: 'category',
              params: { id: encodeName(row.original.wta_category) }
            }"
            :class="wtaClass"
          >
            {{ row.original.wta_category }}
          </u-link>
        </div>
      </div>
    </template>
  </u-table>
</template>
