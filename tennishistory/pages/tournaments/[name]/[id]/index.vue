<script setup lang="ts">
definePageMeta({
  name: "tournament",
  middleware: [
    function (to, from) {
      if (["8888", "9900", "615"].includes(to.params.id as string)) {
        return navigateTo({ name: "country-tournament" })
      }
    }
  ]
})
const appConfig = useAppConfig()
const route = useRoute()
const toast = useToast()

const name = computed(() => decodeName(route.params.name as string))
useHead({ title: name.value, templateParams: { subPage: "Tournaments" } })

// Breadcrumbs
const items = computed(() => [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Tournaments", to: { name: "tournaments" }, icon: ICONS.tournament },
  { label: name.value }
])

const breakpoints = useBreakpoints(breakpointsTailwind)
const xlAndUp = breakpoints.greaterOrEqual("xl")
const lgAndUp = breakpoints.greaterOrEqual("lg")

const selectedTab = ref("winners")
const tabs = [
  { label: "Winners", value: "winners", icon: ICONS.tournament },
  { label: "By the Numbers", value: "numbers", icon: ICONS.stats }
]

interface TournamentType extends Pick<TournamentInterface, "website" | "years"> {
  events: (Pick<EventInterface, "id" | "year" | "draw_type" | "winner" | "loser"> & {
    match: Pick<MatchInterface, "sets" | "tbs" | "incomplete">
  })[]
}

// API call
const { data: tournament, status } = await useFetch<TournamentType>("/api/tournaments/details", {
  query: { tid: route.params.id },
  onResponseError: ({ error }) => {
    toast.add({
      title: `Error fetching details about ${name.value}`,
      description: error?.message,
      icon: appConfig.ui.icons.error,
      color: "error"
    })
    showError(error!)
  }
})

// Anchor links
const links = computed(() => {
  if (selectedTab.value === "numbers") {
    return [
      {
        to: "#historical-pm",
        label: "Historical Prize Money"
      },
      {
        to: "#winners",
        label: "Winners"
      },
      {
        to: "#runners-up",
        label: "Runners Up by No. of Finals"
      },
      {
        to: "#finalists",
        label: "Finalists by No. of Finals"
      },
      {
        to: "#country-winners",
        label: "Countries by No. of Winners"
      },
      {
        to: "#winners-by-age",
        label: "Winners by Age"
      },
      {
        to: "#games-sets-lost",
        label: "Winners by Games & Sets Lost"
      }
    ]
  } else if (tournament.value) {
    return tournament.value.events.map(event => ({
      to: "#event-" + event.id,
      label: event.year
    }))
  }
})
</script>

<template>
  <div>
    <nuxt-layout name="default">
      <template #title>
        <u-breadcrumb :items />
      </template>

      <template #trailing>
        <span class="text-sm text-(--ui-text-muted)"> ({{ tournament?.years }}) </span>
      </template>

      <template #right>
        <ClientOnly>
          <u-button
            v-if="tournament?.website"
            :to="tournament.website"
            target="_blank"
            label="Website"
            :icon="ICONS.website"
            :size="lgAndUp ? 'md' : 'sm'"
          />
        </ClientOnly>
      </template>

      <template #toolbar>
        <div class="flex flex-wrap items-center justify-between w-full gap-5 lg:gap-30 2xl:gap-50">
          <ClientOnly>
            <u-tabs
              v-model="selectedTab"
              :items="tabs"
              class="order-last sm:order-first"
              variant="link"
              :size="xlAndUp ? 'md' : 'xs'"
            />
          </ClientOnly>
          <!--TOC-->
          <u-dropdown-menu :items="links">
            <u-button
              :icon="ICONS.toc"
              color="neutral"
              variant="link"
              size="xl"
              class="order-first sm:order-last"
            />
          </u-dropdown-menu>
        </div>
      </template>

      <div v-if="selectedTab === 'winners'">
        <u-page-grid v-if="tournament?.events.length || ['pending', 'idle'].includes(status)">
          <tournament-event-card
            v-if="tournament?.events.length"
            v-for="event in tournament.events"
            :key="event.id"
            :id="event.id"
            :event
          />
          <tournament-event-loading-card
            v-else
            v-for="_ in 10"
            :key="_"
          />
        </u-page-grid>
        <error-message
          v-else-if="tournament"
          :icon="ICONS.noTournament"
          :title="`No events found for ${name}`"
        />
      </div>
      <tournament-numbers v-else />
    </nuxt-layout>
  </div>
</template>
