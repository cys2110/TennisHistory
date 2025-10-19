<script setup lang="ts">
import { type TableColumn, type TableRow } from "@nuxt/ui"

const { status, count, players } = defineProps<{
  players: PlayerInterface[]
  resetFilters: () => void
  count: number
  status: APIStatusType
}>()
const skip = defineModel<number>("skip")
const filters = defineModel<PlayerFiltersType>("filters")

const {
  ui: { colors }
} = useAppConfig()
const table = useTemplateRef<any>("table")

const currentYear = new Date().getFullYear()

onMounted(() => {
  useInfiniteScroll(
    table.value?.$el,
    () => {
      set(skip, get(skip)! + 40)
    },
    {
      distance: 50,
      canLoadMore: () => {
        return get(status) !== "pending" && count > players.length
      }
    }
  )
})

const columns: TableColumn<PlayerInterface>[] = [
  { accessorKey: "tour" },
  { id: "status", accessorFn: row => (row.max_year === currentYear ? "Active" : "Inactive") },
  { accessorKey: "country" },
  { id: "name", accessorFn: row => `${row.first_name} ${row.last_name}`, footer: () => `${count} players` },
  { accessorKey: "min_year" },
  { accessorKey: "max_year" },
  { accessorKey: "coaches" }
]

const handleSelect = async (row: TableRow<PlayerInterface>) => {
  await navigateTo({
    name: "player",
    params: { id: row.original.id, name: row.original.first_name ? kebabCase(`${row.original.first_name} ${row.original.last_name}`) : "-" }
  })
}
</script>

<template>
  <u-dashboard-panel>
    <template #header>
      <u-dashboard-navbar>
        <template #title> <page-title /> </template>
      </u-dashboard-navbar>

      <u-dashboard-toolbar>
        <dev-only>
          <player-create />
        </dev-only>

        <u-button
          label="Reset Filters"
          :icon="ICONS.noFilter"
          @click="resetFilters"
          block
        />

        <table-visibility
          v-if="table"
          :table="table!"
        />
      </u-dashboard-toolbar>
    </template>

    <template #body>
      <u-table
        ref="table"
        :data="players"
        :columns
        :loading="status === 'pending'"
        sticky
        render-fallback-value="—"
        @select="handleSelect"
        :ui="{ tbody: '[&>tr]:cursor-pointer' }"
      >
        <template #loading>
          <loading-table-message />
        </template>
        <template #empty>
          <empty-table
            message="No players found"
            :icon="ICONS.noPeople"
          />
        </template>
        <template #tour-header>
          <form-select-menu
            v-if="filters"
            v-model="filters.tour"
            :items="[TourEnum['ATP'], TourEnum['WTA']]"
            placeholder="Tour"
            :icon="ICONS.tour"
          />
        </template>
        <template #tour-cell="{ row }">
          <u-badge
            :label="TourEnum[row.original.tour]"
            :color="row.original.tour"
          />
        </template>
        <template #status-header>
          <form-select-menu
            v-if="filters"
            v-model="filters.status"
            :items="['Active', 'Inactive']"
            placeholder="Status"
            :icon="ICONS.tennis"
          />
        </template>
        <template #status-cell="{ cell }">
          <u-badge
            :label="(cell.getValue() as string)"
            :color="(cell.getValue() as keyof typeof colors )"
          />
        </template>
        <template #country-header>
          <form-select-search
            v-if="filters"
            v-model="filters.countries"
            placeholder="Country"
            type="countries"
            :icon="ICONS.countries"
          />
        </template>
        <template #country-cell="{ row }">
          <country-link
            :country="row.original.country"
            icon-only
          />
        </template>
        <template #name-header>
          <form-select-search
            v-if="filters"
            v-model="filters.players"
            placeholder="Player"
            type="players"
            :icon="ICONS.player"
          />
        </template>
        <template #min_year-header>
          <form-input
            v-if="filters"
            v-model="filters.minYear"
            type="number"
            placeholder="Year of First Tournament"
          />
        </template>
        <template #max_year-header>
          <form-input
            v-if="filters"
            v-model="filters.maxYear"
            type="number"
            placeholder="Year of Last Tournament"
          />
        </template>
        <template #coaches-header>
          <form-select-search
            v-if="filters"
            v-model="filters.coaches"
            placeholder="Coach"
            type="coaches"
            :icon="ICONS.coach"
          />
        </template>
        <template #coaches-cell="{ row }">
          <div
            v-for="coach in row.original.coaches"
            :key="coach.id"
          >
            <div class="flex flex-col justify-center">
              <u-link
                v-if="coach.labels.includes('Player')"
                class="hover-link default-link w-fit mx-auto"
              >
                {{ coach.first_name }} {{ coach.last_name }}
              </u-link>
              <span v-else>{{ coach.first_name }} {{ coach.last_name }}</span>
              <span v-if="coach.start_date && coach.end_date">
                ({{ shortDateFormat.formatRange(new Date(coach.start_date), new Date(coach.end_date)) }})
              </span>
              <span v-else-if="coach.start_date"> ({{ useDateFormat(coach.start_date, "DD MMMM YYYY").value }}) </span>
            </div>
          </div>
        </template>
      </u-table>
    </template>
  </u-dashboard-panel>
</template>
