<script setup lang="ts">
import { PlayerStatsGrid, PlayerStatsTable } from "#components"

definePageMeta({ name: "stats" })
const { icons } = useAppConfig()
const { viewMode } = useViewMode()
const { params } = useRoute()
const { id } = params as { id: string }
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1280 })
const mdAndDown = breakpoints.smallerOrEqual("md")

const playerYears = useState<string[]>("player-years")
const years = ref<string[] | undefined>()
const surfaces = ref<SurfaceType[] | undefined>()
const environments = ref<EnvironmentType[] | undefined>()
const draw = ref<DrawType>("Main")
const level = ref<"Tour" | "Challenger">("Tour")

// API call
const { data: stats, status } = await useFetch<PlayerStatsType[]>("/api/players/stats", {
  key: `stats-${id}`,
  query: { id, years, surfaces, environments, draw, level },
  default: () => []
})
</script>

<template>
  <player-wrapper>
    <template #toolbar="{ first_name, last_name, tour }">
      <u-slideover
        v-if="mdAndDown"
        :title="`${first_name} ${last_name}`"
        class="ml-auto"
      >
        <u-button
          size="xs"
          :icon="icons.filter"
        />

        <template #body>
          <filter-select-years
            v-if="playerYears.length"
            v-model="years"
            :items="playerYears"
          />
          <filter-checkbox-surface
            v-model="surfaces"
            v-model:environment="environments"
          />
          <u-radio-group
            legend="Draw"
            v-model="draw"
            :items="['Main', 'Qualifying']"
            orientation="horizontal"
          />
          <u-radio-group
            legend="Level"
            v-model="level"
            :items="['Tour', 'Challenger']"
            orientation="horizontal"
          />
        </template>
      </u-slideover>
      <template v-else>
        <filter-select-years
          v-if="playerYears.length"
          v-model="years"
          :items="playerYears"
        />
        <filter-checkbox-surface
          v-model="surfaces"
          v-model:environment="environments"
        />
        <u-radio-group
          legend="Draw"
          v-model="draw"
          :items="['Main', 'Qualifying']"
          orientation="horizontal"
        />
        <u-radio-group
          legend="Level"
          v-model="level"
          :items="['Tour', 'Challenger']"
          orientation="horizontal"
        />
        <player-stats-chart
          v-if="stats.length"
          :stats
          :key="JSON.stringify(years) + 'chart'"
          :tour
          :first-name="first_name"
          :last-name="last_name"
        />
      </template>
    </template>

    <template #default="{ tour, first_name, last_name }">
      <component
        :is="viewMode === 'cards' ? PlayerStatsGrid : PlayerStatsTable"
        :key="viewMode"
        :stats
        :status
        :years
        :tour
        :first-name="first_name"
        :last-name="last_name"
      />
    </template>
  </player-wrapper>
</template>
