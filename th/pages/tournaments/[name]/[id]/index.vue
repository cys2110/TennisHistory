<script setup lang="ts">
import { TournamentNumbers, TournamentWinners } from "#components"

definePageMeta({ name: "tournament" })
const {
  icons,
  ui: { icons: appIcons }
} = useAppConfig()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1280 })
const mdAndUp = breakpoints.greaterOrEqual("md")
const xlAndUp = breakpoints.greaterOrEqual("xl")

const {
  params: { name: paramName, id: paramId }
} = useRoute()
const name = computed(() => decodeName(paramName as string))
useHead({ title: () => name.value, templateParams: { subPage: "Tournaments" } })

const selectedTab = ref("winners")
const tabs = [
  { label: "Winners", value: "winners", icon: icons.tournament },
  { label: "By the Numbers", value: "numbers", icon: icons.stats }
]

// API call
const { data: tournament } = await useFetch<Pick<TournamentInterface, "website" | "years" | "tours">>("/api/tournaments/details", {
  query: { id: paramId }
})

provide<TourType[]>("tours", tournament.value?.tours || [])
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
      <div class="flex items-center gap-2 justify-center">
        <u-badge
          v-if="tournament"
          v-for="tour in tournament?.tours.filter(t => t !== 'ITF')"
          :key="tour"
          :label="tour"
          :color="tour.toLowerCase() as 'atp' | 'wta' | 'men' | 'women'"
          variant="outline"
          size="lg"
        />
      </div>
      <u-tabs
        v-if="!COUNTRY_DRAWS.includes(paramId as string)"
        v-model="selectedTab"
        :items="tabs"
        variant="link"
        :size="xlAndUp ? 'md' : 'sm'"
      />
      <div class="text-(--ui-text-muted) font-semibold">{{ tournament?.years }}</div>
    </template>

    <component
      :is="selectedTab === 'winners' ? TournamentWinners : TournamentNumbers"
      :key="selectedTab"
      :tours="tournament?.tours"
    />
  </page-wrapper>
</template>
