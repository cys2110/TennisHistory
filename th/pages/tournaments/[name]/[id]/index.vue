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
const paramName = useRouteParams<string>("name")
const tid = useRouteParams<string>("id")
const name = computed(() => decodeName(paramName.value))
useHead({ title: name.value, templateParams: { subPage: "Tournaments" } })
const selectedTab = ref("winners")
const tabs = [
  { label: "Winners", value: "winners", icon: ICONS.tournament },
  { label: "By the Numbers", value: "numbers", icon: ICONS.stats }
]

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
  if (tournament.value)
    return tournament.value.events.map(event => ({
      to: "#event-" + event.eid,
      label: event.year
    }))
})
</script>

<template>
  <div>
    <nuxt-layout name="default">
      <template #title>
        <u-breadcrumb :items />
      </template>

      <template #right>
        <u-button
          v-if="tournament?.website"
          :to="tournament.website"
          target="_blank"
          label="Website"
          :icon="ICONS.website"
        />
      </template>

      <template #toolbar>
        <div class="text-(--ui-text-muted)">{{ tournament?.years }}</div>

        <u-tabs
          v-model="selectedTab"
          :items="tabs"
          class="w-96"
        />

        <!--TOC-->
        <u-dropdown-menu :items="links">
          <u-button
            :icon="ICONS.toc"
            color="neutral"
            variant="link"
            size="xl"
          />
        </u-dropdown-menu>
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
      <tournament-numbers v-if="selectedTab === 'numbers'" />
    </nuxt-layout>
  </div>
</template>
