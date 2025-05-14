<script setup lang="ts">
import { CountryTournamentGrid, CountryTournamentTable } from "#components"

definePageMeta({
  name: "country-tournament",
  middleware: [
    function (to, from) {
      if (!COUNTRY_DRAWS.includes(to.params.id as string)) return navigateTo({ name: "tournament" })
    }
  ]
})
const appConfig = useAppConfig()
const route = useRoute()
const toast = useToast()
const { viewMode } = useViewMode()

const name = computed(() => decodeName(route.params.name as string))
useHead({ title: name.value, templateParams: { subPage: "Tournaments" } })

// Breadcrumbs
const breadcrumbs = computed(() => [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Tournaments", to: { name: "tournaments" }, icon: ICONS.tournament },
  { label: name.value }
])

interface TournamentDetails extends Pick<TournamentInterface, "website" | "years"> {
  events: CountryEventType[]
}

// API call
const { data: tournament, status } = await useFetch<TournamentDetails>("/api/tournaments/country-tournament-details", {
  query: { id: route.params.id },
  default: () => ({ website: "", years: "", events: [] }),
  onResponseError: ({ error }) => {
    toast.add({
      title: `Error fetching details for ${name.value}`,
      description: error?.message,
      icon: appConfig.ui.icons.error,
      color: "error"
    })
    showError(error!)
  }
})
</script>

<template>
  <div class="w-full">
    <u-dashboard-panel>
      <template #header>
        <u-dashboard-navbar>
          <template #leading>
            <u-dashboard-sidebar-collapse />
          </template>

          <template #title>
            <u-breadcrumb :items="breadcrumbs" />
          </template>

          <template #right>
            <u-button
              v-if="tournament?.website"
              :to="tournament.website"
              target="_blank"
              label="Website"
              :icon="ICONS.website"
              size="xs"
            />
          </template>
        </u-dashboard-navbar>

        <u-dashboard-toolbar>
          <div class="text-(--ui-text-muted)">{{ tournament?.years }}</div>
        </u-dashboard-toolbar>
      </template>

      <template #body>
        <component
          :is="viewMode === 'cards' ? CountryTournamentGrid : CountryTournamentTable"
          :key="viewMode"
          :events="tournament.events"
          :status
        />
      </template>
    </u-dashboard-panel>
  </div>
</template>
