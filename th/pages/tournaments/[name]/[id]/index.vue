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
const toast = useToast()
const breakpoints = useBreakpoints(breakpointsTailwind)
const mdAndUp = breakpoints.greaterOrEqual("md")
const xlAndUp = breakpoints.greaterOrEqual("xl")
const lgAndUp = breakpoints.greaterOrEqual("lg")
const paramName = useRouteParams<string>("name")
const tid = useRouteParams<string>("id")
const name = computed(() => decodeName(paramName.value))
useHead({ title: name.value, templateParams: { subPage: "Tournaments" } })
const selectedTab = ref("winners")
const tabs = [
  { label: "Winners", value: "winners", icon: ICONS.tournament },
  { label: "By the Numbers", value: "numbers", icon: ICONS.stats }
]
const checked = ref(false)

// API call
const { data: tournament, status } = await useFetch<Pick<TournamentInterface, "website" | "years"> & { events: TournamentEventType[] }>("/api/tournament-details", {
  query: { tid },
  onResponseError: () => {
    toast.add({
      title: `Error fetching overview for ${name.value}`,
      icon: ICONS.error,
      color: "error"
    })
  }
})

// Breadcrumbs
const items = computed(() => [{ label: "Home", to: { name: "home" }, icon: ICONS.home }, { label: "Tournaments", to: { name: "tournaments" }, icon: ICONS.tournament }, { label: name.value }])

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
      to: "#event-" + event.eid,
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
        <span class="text-sm text-(--ui-text-muted)">({{ tournament?.years }})</span>
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
        <ClientOnly>
          <div class="flex flex-wrap items-center justify-between w-full gap-5 lg:gap-30 2xl:gap-50">
            <div class="order-1">
              <u-switch
                v-if="mdAndUp && selectedTab === 'numbers'"
                v-model="checked"
                :checked-icon="ICONS.table"
                :unchecked-icon="ICONS.areaChart"
                :label="checked ? 'Table view' : 'Chart view'"
              />
            </div>
            <u-tabs
              v-model="selectedTab"
              :items="tabs"
              class="order-3 sm:order-2"
              variant="link"
              :size="xlAndUp ? 'md' : 'xs'"
            />
            <!--TOC-->
            <u-dropdown-menu :items="links">
              <u-button
                :icon="ICONS.toc"
                color="neutral"
                variant="link"
                size="xl"
                class="order-2 sm:order-3"
              />
            </u-dropdown-menu>
          </div>
        </ClientOnly>
      </template>

      <div v-if="selectedTab === 'winners'">
        <tournament-details
          v-if="tournament && tournament.events.length > 0"
          :events="tournament?.events"
        />
        <error-message
          v-else-if="tournament"
          :icon="ICONS.noTournament"
          :title="`No events found for ${name}`"
          :status
        />
      </div>
      <tournament-numbers
        v-if="selectedTab === 'numbers'"
        :checked
      />
    </nuxt-layout>
  </div>
</template>
