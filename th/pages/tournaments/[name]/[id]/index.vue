<script setup lang="ts">
import { TournamentNumbers, TournamentWinners } from "#components"

definePageMeta({
  name: "tournament",
  middleware: [
    function (to, from) {
      if (COUNTRY_DRAWS.includes(to.params.id as string)) {
        return navigateTo({ name: "country-tournament" })
      }
    }
  ]
})
const appConfig = useAppConfig()
const route = useRoute()
const toast = useToast()

const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1280 })
const xlAndUp = breakpoints.greaterOrEqual("xl")
const name = computed(() => decodeName(route.params.name as string))
useHead({ title: name.value, templateParams: { subPage: "Tournaments" } })

// Breadcrumbs
const breadcrumbs = computed(() => [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Tournaments", to: { name: "tournaments" }, icon: ICONS.tournament },
  { label: name.value }
])

const selectedTab = ref("winners")
const tabs = [
  { label: "Winners", value: "winners", icon: ICONS.tournament },
  { label: "By the Numbers", value: "numbers", icon: ICONS.stats }
]

// API call
const { data: tournament, status } = await useFetch<Pick<TournamentInterface, "website" | "years">>("/api/tournaments/details", {
  query: { id: route.params.id },
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

          <template #trailing>
            <span class="text-sm text-(--ui-text-muted)"> ({{ tournament?.years }}) </span>
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
          <u-tabs
            v-model="selectedTab"
            :items="tabs"
            class="order-last sm:order-first w-full"
            variant="pill"
            :size="xlAndUp ? 'sm' : 'xs'"
          />
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
