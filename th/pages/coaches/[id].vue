<script setup lang="ts">
import { CoachGrid, CoachTable } from "#components"

definePageMeta({ name: "coach" })
const appConfig = useAppConfig()
const route = useRoute()
const toast = useToast()
const { viewMode } = useViewMode()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1280 })
const mdAndUp = breakpoints.greaterOrEqual("md")

const id = computed(() => decodeName(route.params.id as string))

interface CoachAPIResponse {
  labels: string[]
  name: string
  players: (Pick<PlayerInterface, "id" | "name" | "country" | "min_year" | "max_year" | "ch" | "ch_date" | "dob"> & {
    coach_start: string | null
    coach_end: string | null
    gs: Pick<EventInterface, "year" | "id" | "tournament">[]
  })[]
}

// API call
const { data: coach, status } = await useFetch<CoachAPIResponse>("/api/coaches/details", {
  query: { id },
  default: () => ({ labels: [], name: "", players: [] }),
  onResponseError: ({ error }) => {
    toast.add({
      title: `Error fetching details about ${id.value}`,
      description: error?.message,
      icon: appConfig.ui.icons.error,
      color: "error"
    })
    showError(error!)
  }
})

useHead({ title: coach.value?.name ?? id.value, templateParams: { subPage: "Coaches" } })

// Breadcrumbs
const breadcrumbs = computed(() => [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Coaches", to: { name: "coaches" }, icon: ICONS.coach },
  { slot: "coach", label: coach.value?.name ?? id.value }
])
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
            <u-breadcrumb :items="breadcrumbs">
              <template #coach-leading>
                <u-avatar
                  v-if="coach && coach.labels.includes('Player')"
                  :src="`https://www.atptour.com/-/media/alias/player-headshot/${route.params.id}`"
                  :to="{
                    name: 'player',
                    params: { id: route.params.id, name: encodeName(coach.name) }
                  }"
                  :icon="ICONS.coach"
                  size="sm"
                />
              </template>
            </u-breadcrumb>
          </template>

          <template #right>
            <u-button
              v-if="coach && coach.labels.includes('Player')"
              :icon="ICONS.player"
              label="Player Profile"
              :to="{ name: 'player', params: { id: route.params.id, name: encodeName(coach.name) } }"
              size="sm"
            />
          </template>
        </u-dashboard-navbar>

        <u-dashboard-toolbar>
          <div class="text-(--ui-text-muted) text-sm font-semibold mx-auto"> Players coached by {{ coach?.name }} </div>
        </u-dashboard-toolbar>
      </template>

      <template #body>
        <component
          :is="viewMode === 'cards' ? CoachGrid : CoachTable"
          :key="viewMode"
          :players="coach.players"
          :status
          :name="coach.name"
        />
      </template>
    </u-dashboard-panel>
  </div>
</template>
