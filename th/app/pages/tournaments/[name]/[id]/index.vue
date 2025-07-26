<script setup lang="ts">
import { TournamentNumbers, TournamentWinners } from "#components"

definePageMeta({ name: "tournament" })
const { params } = useRoute()
const { id, name } = params as { id: string; name: string }
const {
  icons,
  ui: { icons: appIcons }
} = useAppConfig()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1280 })
const mdAndUp = breakpoints.greaterOrEqual("md")
const xlAndUp = breakpoints.greaterOrEqual("xl")

const selectedTab = ref("numbers")
const tabs = [
  { label: "Winners", value: "winners", icon: icons.tournament },
  { label: "By the Numbers", value: "numbers", icon: icons.stats }
]

// API call
const { data: tournament } = await useFetch<TournamentInterface>("/api/tournaments/overview", {
  key: `tournament-overview-${id}`,
  query: { id }
})

useHead({ title: () => tournament.value?.name ?? capitalCase(name) })

provide<TourType[]>("tours", tournament.value?.tours || [])
provide<string>("tournamentName", tournament.value?.name || capitalCase(name))
</script>

<template>
  <page-wrapper>
    <template #nav-right>
      <u-button
        v-if="tournament?.website"
        :to="tournament.website"
        target="_blank"
        :label="mdAndUp ? 'Website' : undefined"
        :icon="appIcons.external"
        size="xs"
      />
    </template>

    <template #toolbar>
      <div class="flex items-center gap-2">
        <u-badge
          v-if="tournament"
          v-for="tour in tournament.tours"
          :key="tour"
          :label="tour"
          :color="tour.toLowerCase() as 'atp'"
          size="lg"
        />
      </div>
      <u-tabs
        v-if="!COUNTRY_DRAWS.includes(id as string)"
        v-model="selectedTab"
        :items="tabs"
        variant="link"
        :size="xlAndUp ? 'md' : 'sm'"
      />
      <div class="text-(--ui-text-muted) font-semibold">{{
        tournament?.established && tournament?.abolished ?
          tournament.established === tournament.abolished ?
            tournament.established
          : `${tournament.established} - ${tournament.abolished}`
        : tournament?.established ? `${tournament.established} - present`
        : ""
      }}</div>
    </template>

    <component
      :is="selectedTab === 'winners' ? TournamentWinners : TournamentNumbers"
      :key="selectedTab"
      :tours="tournament?.tours"
    />
  </page-wrapper>
</template>
