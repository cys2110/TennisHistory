<script setup lang="ts">
import { TournamentNumbers, TournamentWinners } from "#components"

definePageMeta({ name: "tournament" })
const {
  params: { id, name }
} = useRoute("tournament")
const {
  ui: { icons }
} = useAppConfig()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1280 })
const mdAndDown = breakpoints.smallerOrEqual("md")
const mdAndUp = breakpoints.greaterOrEqual("md")
const xlAndUp = breakpoints.greaterOrEqual("xl")

const selectedTab = ref("winners")
const tabs = [
  { label: "Winners", value: "winners", icon: ICONS.tournament },
  { label: "By the Numbers", value: "numbers", icon: ICONS.stats }
]

// API call
const { data: tournament } = await useFetch<TournamentInterface>("/api/tournaments/overview", {
  key: `tournament-overview-${id}`,
  query: { id }
})

useHead({ title: () => tournament.value?.name ?? capitalCase(name as string) })

provide<TourType[]>("tours", tournament.value?.tours || [])
provide<string>("tournamentName", tournament.value?.name || capitalCase(name as string))
</script>

<template>
  <div class="w-full">
    <u-dashboard-panel>
      <template #header>
        <u-dashboard-navbar>
          <template #title>
            <page-title />
          </template>

          <template #right>
            <u-button
              v-if="tournament?.website"
              :to="tournament.website"
              target="_blank"
              :label="mdAndUp ? 'Website' : undefined"
              :icon="icons.external"
              size="xs"
            />
            <div id="navbar-right" />
          </template>
        </u-dashboard-navbar>

        <u-dashboard-toolbar>
          <div class="flex items-center gap-2">
            <u-badge
              v-if="tournament"
              v-for="tour in tournament.tours"
              :key="tour"
              :label="tour"
              :color="getTourColour(tour)"
              :size="mdAndDown ? 'md' : 'lg'"
            />
          </div>
          <u-tabs
            v-if="!COUNTRY_DRAWS.includes(id as string)"
            v-model="selectedTab"
            :items="tabs"
            variant="link"
            :size="xlAndUp ? 'md' : 'sm'"
          />
          <div
            v-if="mdAndUp"
            class="text-(--ui-text-muted) font-semibold"
          >
            <span v-if="tournament?.established">{{ tournament.established }}</span>
            <span v-if="tournament?.established && !tournament.abolished"> - present</span>
            <span v-else-if="tournament?.abolished && tournament.established !== tournament.abolished"> - {{ tournament.abolished }}</span>
          </div>
        </u-dashboard-toolbar>
      </template>

      <template #body>
        <component
          :is="selectedTab === 'winners' ? TournamentWinners : TournamentNumbers"
          :key="selectedTab"
        />
      </template>
    </u-dashboard-panel>
  </div>
</template>
