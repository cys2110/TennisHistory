<script setup lang="ts">
definePageMeta({ name: "tournament" })
const {
  params: { id, name }
} = useRoute("tournament")
const {
  icons,
  ui: { icons: uIcons }
} = useAppConfig()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1280 })
const mdAndUp = breakpoints.greaterOrEqual("md")

const selectedTab = ref("winners")
const tabs = [
  { label: "Winners", value: "winners", icon: icons.tournament },
  { label: "By the Numbers", value: "numbers", icon: icons.stats }
]

// API call
const { data: tournament } = await useFetch<TournamentInterface>("/api/tournaments/overview", {
  key: `tournament-overview-${id}`,
  query: { id }
})

useHead({ title: () => tournament.value?.name ?? capitalCase(name as string) })
useJsonld(() => ({
  "@context": "https://schema.org",
  "@type": "Event",
  name: tournament.value?.name || capitalCase(name as string),
  identifier: tournament.value?.id.toString()
}))
provide<TourType[]>("tours", tournament.value?.tours || [])
provide<string>("tournamentName", tournament.value?.name || capitalCase(name as string))
</script>

<template>
  <u-container>
    <u-page>
      <template
        #left
        v-if="!COUNTRY_DRAWS.includes(id as string)"
      >
        <u-page-aside>
          <u-tabs
            :items="tabs"
            v-model="selectedTab"
            variant="link"
            orientation="vertical"
          />
        </u-page-aside>
      </template>

      <template #right>
        <u-page-aside>
          <div id="page-right" />
        </u-page-aside>
      </template>

      <u-page-header
        :title="tournament?.name ?? capitalCase(name as string)"
        :ui="{ description: 'flex items-center justify-between' }"
      >
        <template #headline>
          <div
            v-if="tournament?.tours"
            class="flex items-center gap-2"
          >
            <u-badge
              v-for="tour in tournament.tours"
              :key="tour"
              :label="tour"
              :color="getTourColour(tour)"
            />
          </div>
        </template>

        <template #description>
          <div>
            <span v-if="tournament?.established">{{ tournament.established }}</span>
            <span v-if="tournament?.established && !tournament.abolished"> - present</span>
            <span v-else-if="tournament?.abolished && tournament.established !== tournament.abolished"> - {{ tournament.abolished }}</span>
          </div>
          <div id="header-description" />
        </template>

        <template #links>
          <u-button
            v-if="tournament?.website"
            :to="tournament.website"
            target="_blank"
            :label="mdAndUp ? 'Website' : undefined"
            :icon="uIcons.external"
          />
          <div id="header-links" />
        </template>
      </u-page-header>

      <u-page-body>
        <tournament-winners v-if="selectedTab === 'winners'" />

        <tournament-numbers v-else />
      </u-page-body>
    </u-page>
  </u-container>
</template>
