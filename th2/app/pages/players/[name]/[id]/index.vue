<script setup lang="ts">
import { PlayerDetailsGrid, PlayerDetailsTable } from "#components"

definePageMeta({ name: "player" })
const { id, name } = useRoute().params as { id: string; name: string }
const {
  icons,
  ui: { icons: uIcons }
} = useAppConfig()
const { viewMode } = useDefaults()
const playerYears = useState<string[]>("player-years")
const playerTour = useState<TourType>("player-tour")

// Determine whether player is still active on tour
const activeYears = computed(() => {
  let active = false
  let numberOfYears = 0
  let activeYears = ""
  if (playerYears.value.length > 0) {
    const lastYear = playerYears.value[playerYears.value.length - 1]
    active = Number(lastYear) === new Date().getFullYear()
    numberOfYears = Number(lastYear) - Number(playerYears.value[0]) + 1
    activeYears = `${playerYears.value[0]}${
      playerYears.value.length > 1 ? ` — ${active ? "present" : playerYears.value[playerYears.value.length - 1]}` : ""
    }`
  }
  return { active, numberOfYears, activeYears }
})

// API call
const { data: player, status } = await useFetch<PlayerInterface>("/api/players/details", {
  key: `player-${id}`,
  query: { id }
})
</script>

<template>
  <player-wrapper v-slot="{ otherLinks, country, first_name, last_name }">
    <u-dashboard-panel>
      <template #header>
        <u-dashboard-navbar>
          <template #title>
            <page-title />
          </template>

          <template #right>
            <!--@vue-expect-error-->
            <u-dropdown-menu :items="PLAYER_PAGES.map(page => ({ ...page, to: { name: page.name, params: { name, id } } }))">
              <u-button
                :icon="icons.layers"
                variant="ghost"
              />
            </u-dropdown-menu>
            <u-dropdown-menu :items="otherLinks">
              <u-button
                :icon="uIcons.ellipsis"
                variant="ghost"
                :ui="{ leadingIcon: 'rotate-90' }"
              />
            </u-dropdown-menu>
          </template>
        </u-dashboard-navbar>
      </template>

      <template #body>
        <u-page-header
          :title="`${first_name} ${last_name.toUpperCase()}`"
          :description="`Years Active: ${activeYears.activeYears} (${activeYears.numberOfYears} ${activeYears.numberOfYears === 1 ? 'year' : 'years'})`"
        >
          <template #headline>
            <country-link :country />
            <u-badge
              :color="activeYears.active ? 'active' : 'inactive'"
              :label="activeYears.active ? 'Active' : 'Inactive'"
            />
            <u-badge
              :color="getTourColour([playerTour])"
              :label="playerTour"
            />
          </template>
        </u-page-header>

        <component
          :is="viewMode === 'list' ? PlayerDetailsTable : PlayerDetailsGrid"
          :active="activeYears.active"
          :player
          :status
        />
      </template>
    </u-dashboard-panel>
  </player-wrapper>
</template>
