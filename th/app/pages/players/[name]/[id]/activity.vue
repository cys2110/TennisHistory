<script setup lang="ts">
import { PlayerActivityGrid, PlayerActivityTable } from "#components"

definePageMeta({ name: "activity" })
const { icons } = useAppConfig()
const { viewMode } = useViewMode()
const { tableMode } = useDefaultTable()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1280 })
const mdAndDown = breakpoints.smallerOrEqual("md")
const { params } = useRoute()
const { id } = params as { id: string }

const playerYears = useState<string[]>("player-years")
const matchType = ref<MatchType>("Singles")
const levels = ref<("Tour" | "Challenger" | "ITF")[]>()
const year = useRouteQuery<string>(
  "year",
  playerYears.value?.length ? playerYears.value[playerYears.value.length - 1]!.toString() : new Date().getFullYear().toString()
)
const componentKey = ref(0)

watch(
  levels,
  () => {
    componentKey.value++
  },
  { deep: true }
)

const apiRoute = computed(() => (matchType.value === "Singles" ? "singles-activity" : "doubles-activity"))

// API call
const { data: yearActivity, status } = await useFetch<ActivityType>(() => `/api/players/${apiRoute.value}`, {
  key: `player-activity-${year}-${matchType.value}`,
  query: { id, year, type: matchType },
  default: () => ({ stats: [], activity: [] })
})

const filteredEvents = computed(() =>
  yearActivity.value.activity.filter(event => {
    if (levels.value && levels.value.length > 0 && levels.value.includes(event.level)) return false
    return true
  })
)
</script>

<template>
  <player-wrapper>
    <template #toolbar>
      <u-slideover
        v-if="mdAndDown"
        title="Filters"
        class="ml-auto"
      >
        <u-button
          size="xs"
          :icon="icons.filter"
        />

        <template #body>
          <filter-radio-group-match-type v-model="matchType" />

          <filter-checkbox-level v-model="levels" />

          <filter-select-year
            v-model="year"
            :items="playerYears"
            class="w-fit"
          />
        </template>
      </u-slideover>

      <template v-else>
        <filter-radio-group-match-type
          v-model="matchType"
          size="md"
        />

        <filter-checkbox-level v-model="levels" />

        <filter-select-year
          v-model="year"
          :items="playerYears"
          class="w-fit"
        />
      </template>
    </template>

    <template #default="{ tour, first_name, last_name }">
      <u-page-grid
        v-if="(yearActivity.stats.length || status === 'pending') && (viewMode !== 'list' || tableMode !== 'grouped')"
        class="md:grid-cols-3"
      >
        <u-card
          v-if="yearActivity.stats.length"
          v-for="stat in yearActivity.stats"
          :key="stat.category"
          class="ring-primary"
          :ui="{ header: 'font-semibold text-muted p-2', body: 'p-2' }"
        >
          <template #header>
            {{ stat.category }}
          </template>

          <div class="text-sm text-accented">
            <div class="flex items-center justify-between">
              <span>Tour</span>
              <span>{{ stat.tour }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span>Challenger</span>
              <span>{{ stat.challenger }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span>ITF</span>
              <span>{{ stat.itf }}</span>
            </div>
          </div>
        </u-card>
        <loading-base
          v-else
          v-for="_ in 3"
          :key="_"
        />
      </u-page-grid>

      <component
        :is="viewMode === 'list' ? PlayerActivityTable : PlayerActivityGrid"
        :key="componentKey"
        :events="filteredEvents"
        :status
        :tour
        :first-name="first_name"
        :last-name="last_name"
        :match-type="matchType"
        :year
      />
    </template>
  </player-wrapper>
</template>
