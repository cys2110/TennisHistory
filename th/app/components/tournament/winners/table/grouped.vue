<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
import { getGroupedRowModel, type GroupingOptions } from "@tanstack/vue-table"

defineProps<{
  events: TournamentWinnerFlattenedType[]
  status: APIStatusType
}>()
const {
  ui: { icons }
} = useAppConfig()
const { params } = useRoute()
const { id, name } = params as { id: string; name: string }
const tours = inject<TourType[]>("tours", [])
const tournamentName = inject<string>("tournamentName", "")

const columns: TableColumn<TournamentWinnerFlattenedType>[] = [
  { id: "expand" },
  { accessorKey: "year" },
  { id: "tour", accessorKey: "tour" },
  { id: "type", accessorKey: "type" },
  { id: "winner", header: "Winner(s)" },
  { id: "finalist", header: "Finalist(s)" },
  { id: "score", header: "Score" }
]

const grouping_options = ref<GroupingOptions>({
  groupedColumnMode: false,
  getGroupedRowModel: getGroupedRowModel()
})
</script>

<template>
  <u-table
    :data="events"
    :columns="
      COUNTRY_DRAWS.includes(id) ? columns.filter(column => column.id !== 'tour' && column.id !== 'type')
      : tours.length === 1 ? columns.filter(column => column.id !== 'tour')
      : columns
    "
    :loading="status === 'pending'"
    sticky
    :grouping="COUNTRY_DRAWS.includes(id) || tours.length === 1 ? ['year'] : ['year', 'tour']"
    :grouping-options="grouping_options"
    :empty="`No events found for ${tournamentName}`"
    :ui="{
      root: 'scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent',
      td: 'empty:p-0' // helps with the colspaned row added for expand slot
    }"
  >
    <template #expand-cell="{ row }">
      <u-button
        v-if="row.getIsGrouped()"
        variant="link"
        color="neutral"
        class="mr-2"
        size="xs"
        :icon="icons.chevronDoubleRight"
        :ui="{ leadingIcon: row.getIsExpanded() ? 'rotate-90 transition-transform duration-200' : 'transition-transform duration-200' }"
        @click="row.toggleExpanded()"
      />
    </template>

    <template #year-header="{ column }">
      <sort-table-header
        :column
        label="Year"
        type="number"
      />
    </template>

    <template #year-cell="{ row }">
      <u-link
        v-if="row.getIsGrouped() && row.depth === 0"
        :to="{ name: 'event', params: { id, name, year: row.original.year, eid: row.original.id } }"
        class="hover-link font-semibold"
      >
        {{ row.original.year }}
      </u-link>
      <template v-else>{{ "" }}</template>
    </template>

    <template #tour-header="{ column }">
      <sort-table-header
        :column
        label="Tour"
        type="alpha"
      />
    </template>

    <template #tour-cell="{ row }">
      <u-badge
        v-if="row.getIsGrouped() && row.depth === 1"
        :label="row.original.tour"
        :color="row.original.tour?.toLowerCase() as 'atp'"
      />
      <template v-else>{{ "" }}</template>
    </template>

    <template #type-header="{ column }">
      <sort-table-header
        :column
        label="Singles/Doubles"
        type="alpha"
      />
    </template>

    <template #type-cell="{ row }">
      <u-badge
        v-if="!row.getIsGrouped()"
        :label="row.original.type"
        :color="row.original.type === 'Singles' ? 'singles' : 'doubles'"
      />
    </template>

    <template #winner-cell="{ row }">
      <template v-if="!row.getIsGrouped()">
        <div
          v-if="Array.isArray(row.original.winner)"
          class="flex items-center gap-1 justify-center"
        >
          <template
            v-for="(winner, index) in row.original.winner"
            :key="`winner-${index}`"
          >
            <u-separator
              v-if="index > 0"
              class="h-4"
              orientation="vertical"
            />
            <player-link
              v-if="winner"
              :player="winner"
            />
          </template>
        </div>
        <div
          v-else
          class="mx-auto w-fit"
        >
          <country-link
            :country="row.original.winner"
            :icon-only="false"
          />
        </div>
      </template>
    </template>

    <template #finalist-cell="{ row }">
      <template v-if="!row.getIsGrouped()">
        <div
          v-if="Array.isArray(row.original.loser)"
          class="flex items-center gap-1 justify-center"
        >
          <template
            v-for="(loser, index) in row.original.loser"
            :key="`loser-${index}`"
          >
            <u-separator
              v-if="index > 0"
              class="h-4"
              orientation="vertical"
            />
            <player-link
              v-if="loser"
              :player="loser"
            />
          </template>
        </div>
        <div
          v-else
          class="mx-auto w-fit"
        >
          <country-link
            :country="row.original.loser"
            :icon-only="false"
          />
        </div>
      </template>
    </template>

    <template #score-cell="{ row }">
      <template v-if="!row.getIsGrouped()">
        <template v-if="row.original.score">{{ row.original.score }}</template>
        <match-score-item
          v-else
          :labels="row.original.labels as string[]"
          :sets="row.original.sets as number[][][]"
          :year="row.original.year.toString()"
          :id="row.original.id"
          :match_no="1"
          :tournament="{ id: Number(id), name, tours }"
          :stats="row.original.stats"
          centred
        />
      </template>
    </template>
  </u-table>
</template>
