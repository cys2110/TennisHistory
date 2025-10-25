<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"

defineProps<{
  edition: EditionInterface
  events: EventInterface[]
  status: APIStatusType
  refresh?: () => void
}>()

const columns: TableColumn<EventInterface>[] = [
  { accessorKey: "tour", header: "Tour" },
  { accessorKey: "level", header: "Level" },
  { accessorKey: "sponsor_name", header: "Sponsor Name", cell: cell => cell.renderValue() },
  { accessorKey: "category", header: "Category", cell: cell => cell.renderValue() },
  {
    id: "dates",
    header: "Dates",
    accessorFn: row => (row.start_date && row.end_date ? dateTimeFormat.formatRange(new Date(row.start_date), new Date(row.end_date)) : "—")
  },
  { id: "surface", accessorKey: "surface.id", header: "Surface", cell: cell => cell.renderValue() },
  {
    id: "Prize Money",
    accessorFn: row => (row.pm && row.currency ? row.pm.toLocaleString("en-GB", { style: "currency", currency: row.currency }) : "—"),
    header: "Prize Money"
  },
  {
    id: "Total Financial Commitment",
    accessorFn: row => (row.tfc && row.currency ? row.tfc.toLocaleString("en-GB", { style: "currency", currency: row.currency }) : "—"),
    header: "TFC"
  },
  { accessorKey: "venues", header: "Venues" },
  { accessorKey: "winners", header: "Winners" }
]
</script>

<template>
  <table-wrapper>
    <template
      #navbar-right
      v-if="edition.wiki_link"
    >
      <u-button
        :icon="ICONS.wikipedia"
        :href="edition.wiki_link"
        target="_blank"
      />
    </template>
    <template #toolbar>
      <dev-only>
        <editions-update :edition />
        <events-update :refresh />
      </dev-only>
      <div class="flex items-center gap-2 w-full">
        <u-badge
          v-for="tour in edition.tours"
          :key="tour"
          :label="TourEnum[tour]"
          :color="tour"
        />
      </div>
      <u-badge
        color="success"
        :label="`Updated: ${useDateFormat(edition.updated_at, 'DD MMMM YYYY').value}`"
        class="w-full"
      />
    </template>

    <editions-overview :edition />

    <u-table
      ref="table"
      :data="events"
      :columns
      :loading="status === 'pending'"
      sticky
      render-fallback-value="—"
      :ui="{ tbody: '[&>tr]:cursor-pointer' }"
    >
      <template #loading>
        <table-loading />
      </template>

      <template #empty>
        <table-empty
          :icon="ICONS.noEvent"
          message="No events found"
        />
      </template>

      <template #tour-cell="{ row }">
        <u-badge
          :label="TourEnum[row.original.tour]"
          :color="row.original.tour"
        />
      </template>

      <template #level-cell="{ row }">
        <u-badge
          :label="row.original.level"
          :color="row.original.level"
        />
      </template>

      <template #venues-cell="{ row }">
        <div v-if="row.original.venues?.length">
          <div
            v-for="venue in row.original.venues"
            :key="venue.id"
            class="flex items-center gap-1"
          >
            <dev-only>
              <venues-update :venue />
              <template #fallback>
                <span>{{ venue.name ? `${venue.name}, ${venue.city}` : venue.city }}</span>
                <countries-link
                  :country="venue.country"
                  icon-only
                />
              </template>
            </dev-only>
          </div>
        </div>
        <template v-else>—</template>
      </template>

      <template #winners-cell="{ row }">
        <div
          v-if="row.original.winners?.length"
          v-for="winner in row.original.winners"
          :key="winner.type"
          class="flex items-center gap-2"
        >
          <u-badge
            :label="winner.type"
            :color="winner.type"
          />
          <div class="flex flex-col">
            <players-link
              v-for="player in winner.team"
              :key="player.id"
              :player
            />
          </div>
        </div>
        <template v-else>—</template>
      </template>
    </u-table>

    <template #footer> {{ events.length }} event{{ events.length === 1 ? "" : "s" }} </template>
  </table-wrapper>
</template>
