<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
import { createColumnHelper } from "@tanstack/vue-table"
import { EventsAwardsUpdate } from "#components"

const {
  params: { edId, tour }
} = useRoute("event")
const { devMode } = useRuntimeConfig().public
const overlay = useOverlay()
const editRound = overlay.create(EventsAwardsUpdate)

const {
  data: awards,
  status,
  refresh
} = await useFetch<RoundInterface[]>("/api/events/awards", {
  query: { edId, tour },
  default: () => []
})

const consolidatedRounds = computed(() => {
  const uniqueRounds = useArrayUnique(awards.value.map(a => a.round)).value

  return uniqueRounds.map(round => {
    const singles = awards.value.find(a => a.round === round && a.type === "Singles")
    const doubles = awards.value.find(a => a.round === round && a.type === "Doubles")

    return {
      round,
      singlesPm: singles?.pm ?? null,
      singlesPoints: singles?.points ?? null,
      doublesPm: doubles?.pm ?? null,
      doublesPoints: doubles?.points ?? null,
      currency: singles?.currency ?? doubles?.currency ?? null
    }
  })
})

type ConsolidatedRound = (typeof consolidatedRounds.value)[number]

const columnHelper = createColumnHelper<ConsolidatedRound>()

const columns: TableColumn<ConsolidatedRound>[] = [
  { accessorKey: "round", header: "Round" },
  columnHelper.group({
    header: "Singles",
    columns: [
      { accessorKey: "singlesPm", header: "Prize Money" },
      { accessorKey: "singlesPoints", header: "Points" }
    ]
  }),
  columnHelper.group({
    header: "Doubles",
    columns: [
      { accessorKey: "doublesPm", header: "Prize Money" },
      { accessorKey: "doublesPoints", header: "Points" }
    ]
  })
]

const handleEditRound = (round: string, type: "Singles" | "Doubles") => {
  const existingAward = awards.value.find(a => a.round === round && a.type === type)
  editRound.open({ round: existingAward, refresh })
}
</script>

<template>
  <dashboard-subpanel
    id="awards"
    title="Awards"
    :icon="ICONS.awards"
  >
    <template #right>
      <events-awards-update :refresh />
      <events-awards-chart :awards />
    </template>

    <u-table
      :data="consolidatedRounds"
      :columns
      :loading="status === 'pending'"
      sticky
      render-fallback-value="—"
    >
      <template #loading>
        <table-loading />
      </template>

      <template #empty>
        <u-empty
          title="No rounds found"
          :icon="ICONS.noAwards"
        >
          <template
            #actions
            v-if="devMode"
          >
            <events-awards-update :refresh />
          </template>
        </u-empty>
      </template>

      <template #singlesPm-cell="{ cell, row }">
        <div
          @click="devMode ? handleEditRound(row.original.round, 'Singles') : undefined"
          :class="{ 'cursor-pointer': devMode }"
        >
          {{
            isDefined(cell.getValue()) && row.original.currency
              ? (cell.getValue() as number).toLocaleString("en-GB", { style: "currency", currency: row.original.currency })
              : cell.renderValue()
          }}
        </div>
      </template>

      <template #singlesPoints-cell="{ cell }">
        <div
          @click="devMode ? handleEditRound(row.original.round, 'Singles') : undefined"
          :class="{ 'cursor-pointer': devMode }"
        >
          {{ isDefined(cell.getValue()) ? (cell.getValue() as number).toLocaleString() : cell.renderValue() }}
        </div>
      </template>

      <template #doublesPm-cell="{ cell, row }">
        <div
          @click="devMode ? handleEditRound(row.original.round, 'Doubles') : undefined"
          :class="{ 'cursor-pointer': devMode }"
        >
          {{
            isDefined(cell.getValue()) && row.original.currency
              ? (cell.getValue() as number).toLocaleString("en-GB", { style: "currency", currency: row.original.currency })
              : cell.renderValue()
          }}
        </div>
      </template>

      <template #doublesPoints-cell="{ cell }">
        <div
          @click="devMode ? handleEditRound(row.original.round, 'Doubles') : undefined"
          :class="{ 'cursor-pointer': devMode }"
        >
          {{ isDefined(cell.getValue()) ? (cell.getValue() as number).toLocaleString() : cell.renderValue() }}
        </div>
      </template>
    </u-table>
  </dashboard-subpanel>
</template>
