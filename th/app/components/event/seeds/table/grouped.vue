<script setup lang="ts">
import { UButton, UTooltip } from "#components"
import type { TableColumn } from "@nuxt/ui"
import { getGroupedRowModel, type GroupingOptions } from "@tanstack/vue-table"

const { seeds } = defineProps<{ seeds: SeedInterface[]; status: APIStatusType; tournament: string }>()
const { params } = useRoute()
const { year } = params as { year: string }
const {
  icons,
  ui: { icons: appIcons }
} = useAppConfig()
const tours = inject<TourType[]>("tours", [])

const columns: TableColumn<SeedInterface>[] = [
  { id: "expand" },
  { accessorKey: "tour" },
  { accessorKey: "type" },
  { accessorKey: "draw" },
  {
    accessorKey: "seed",
    cell: ({ row }) => {
      if (row.getIsGrouped()) {
        return `${row.getValue("seed")} ${row.getValue("seed") === 1 ? "seed" : "seeds"}`
      } else {
        return h("span", { class: row.original.withdrew && "line-through" }, [row.original.seed])
      }
    },
    aggregationFn: "count"
  },
  {
    id: "player",
    accessorFn: row => {
      const sortedNames = row.team.sort((a, b) => a.last_name.localeCompare(b.last_name))
      return sortedNames[0]?.last_name
    }
  },
  {
    accessorKey: "rank2",
    cell: ({ row }) => {
      if (row.getIsGrouped()) {
        return `Avg: ${row.getValue("rank2") ? Math.round(row.getValue("rank2")) : 0}`
      } else {
        return h("span", { class: row.original.withdrew && "line-through" }, [row.original.rank2])
      }
    },
    aggregationFn: "mean"
  },
  {
    id: "rank",
    accessorFn: row => row.team.reduce((acc, player) => acc + (player.rank ?? 0), 0),
    cell: ({ row }) => {
      if (row.getIsGrouped()) {
        return `Avg: ${row.getValue("rank") ? Math.round(row.getValue("rank")) : 0}`
      } else {
        return h("span", { class: row.original.withdrew && "line-through" }, [
          row.original.team.length === 2 ? `${row.original.team[0]?.rank} / ${row.original.team[1]?.rank}` : row.original.team[0]?.rank
        ])
      }
    },
    aggregationFn: "mean"
  }
]

const grouping_options = ref<GroupingOptions>({
  groupedColumnMode: "remove",
  getGroupedRowModel: getGroupedRowModel()
})
</script>

<template>
  <u-table
    :data="seeds"
    :columns="tours.length > 1 ? columns : columns.filter(c => c.id !== 'tour')"
    :loading="status === 'pending'"
    sticky
    :grouping="tours.length > 1 ? ['tour', 'type', 'draw'] : ['type', 'draw']"
    :grouping-options="grouping_options"
    :empty="`No seeds available for ${tournament} ${year}`"
    :ui="{
      root: 'max-h-200 max-w-full w-fit md:min-w-3/4 xl:min-w-2/3 mx-auto mt-5 scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent',
      td: 'empty:p-0' // helps with the colspaned row added for expand slot
    }"
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
          :icon="row.getIsExpanded() ? appIcons.minus : appIcons.plus"
          @click="row.toggleExpanded()"
        />

        <u-badge
          v-if="row.groupingColumnId === 'tour'"
          class="font-semibold"
          :label="row.original.tour"
          :color="getTourColor([row.original.tour])"
        />

        <u-badge
          v-else-if="row.groupingColumnId === 'type'"
          class="font-semibold"
          :label="row.original.type"
          :color="row.original.type === 'Singles' ? 'singles' : 'doubles'"
        />

        <u-badge
          v-if="row.groupingColumnId === 'draw'"
          class="font-semibold"
          :label="row.original.draw"
          :color="row.original.draw === 'Main' ? 'main' : 'qualifying'"
        />
      </div>
    </template>

    <template #seed-header="{ column }">
      <sort-table-header
        :column
        label="Seed"
        type="number"
      />
    </template>

    <template #player-header="{ column }">
      <sort-table-header
        :column
        label="Player"
        type="alpha"
      />
    </template>

    <template #player-cell="{ row }">
      <div
        v-if="!row.getIsGrouped()"
        class="flex flex-wrap items-center gap-2 mx-auto w-fit"
      >
        <template
          v-for="(player, index) in row.original.team"
          :key="player.id"
        >
          <u-separator
            v-if="index > 0"
            orientation="vertical"
            class="h-4"
          />
          <player-link
            :class="{ 'line-through': row.original.withdrew }"
            :player
          />
        </template>
      </div>
      <template v-else></template>
    </template>

    <template #rank2-header="{ column }">
      <sort-table-header
        :column
        label="Rank (at draw)"
        type="number"
      />
    </template>

    <template #rank-header="{ column }">
      <sort-table-header
        :column
        label="Rank (at event)"
        type="number"
      />
    </template>
  </u-table>
</template>
