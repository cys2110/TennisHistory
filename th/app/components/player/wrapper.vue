<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui"
const {
  name,
  params: { id, name: paramName }
} = useRoute("player")
const {
  icons,
  ui: { icons: uIcons }
} = useAppConfig()

// API call
const { data: player } = await useFetch<PlayerInterface>(() => "/api/players/overview", {
  key: `player-overview-${id}`,
  query: { id }
})

// Set state for other player components
const playerYears = useState<number[]>("player-years", () => player.value?.years || [])
const playerName = useState<string>("player-name", () => (player.value ? `${player.value.first_name} ${player.value.last_name}` : ""))
const playerTour = useState<TourType | string>("player-tour", () => player.value?.tour || "")

useHead({
  title: `${PLAYER_PAGES.find(page => page.name === name)?.label} | ${player.value ? `${player.value.first_name} ${player.value.last_name}` : capitalCase(paramName)}`
})

const otherLinks = computed(() => {
  if (player.value) {
    const playerDetails = player.value
    const colour = playerDetails.tour.toLowerCase() as "wta" | "atp" | "primary"
    return [
      playerDetails.coach && {
        label: "Coach Profile",
        icon: icons.coach,
        to: { name: "coach", params: { id } }
      },
      playerDetails.atp_link && { label: "ATP Profile", color: colour, to: playerDetails.atp_link, target: "_blank" },
      playerDetails.wta_link && { label: "WTA Profile", color: colour, to: playerDetails.wta_link, target: "_blank" },
      playerDetails.official_link && { label: "Official Website", color: colour, to: playerDetails.official_link, target: "_blank" },
      playerDetails.wiki_link && { label: "Wikipedia", color: colour, to: playerDetails.wiki_link, target: "_blank" }
    ].filter(Boolean) as { label: string; icon?: string; to?: string; color: "wta" | "atp" | "primary"; target?: string }[]
  }
  return []
})
</script>

<template>
  <div class="w-full">
    <u-dashboard-panel>
      <template #header>
        <u-dashboard-navbar>
          <template #title>
            <page-title />
          </template>

          <template #right>
            <slot name="navbar-right" />
            <u-dropdown-menu
              :items="PLAYER_PAGES.map(page => ({ ...page, to: { name: page.name, params: { name: paramName, id } } }) as DropdownMenuItem)"
            >
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
        <u-dashboard-toolbar v-if="$slots['toolbar']">
          <slot name="toolbar" />
        </u-dashboard-toolbar>
      </template>

      <template #body>
        <slot
          v-if="player"
          :country="player.country"
        />
      </template>
    </u-dashboard-panel>
  </div>
</template>
