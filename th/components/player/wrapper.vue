<script setup lang="ts">
const {
  icons,
  ui: { icons: appIcons }
} = useAppConfig()
const {
  params: { id, name }
} = useRoute()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1280 })
const xlAndUp = breakpoints.greaterOrEqual("xl")

type APIResponseType = Pick<PlayerInterface, "country" | "tour" | "atp_link" | "wiki_link" | "wta_link" | "official_link"> & {
  years: number[]
  coach: boolean
}

// API call
const { data: player } = await useFetch<APIResponseType>(() => "/api/players/overview", {
  query: { id }
})

// Set state for other player components
const playerYears = useState("player-years", () => player.value?.years ?? [])

const otherLinks = computed(() => {
  if (player.value) {
    const colour = player.value.tour.toLowerCase()
    return [
      player.value.coach && {
        label: "Coach Profile",
        icon: icons.coach,
        to: { name: "coach", params: { id } }
      },
      player.value.atp_link && { label: "ATP Profile", color: colour, icon: appIcons.external, to: player.value.atp_link },
      player.value.wta_link && { label: "WTA Profile", color: colour, icon: appIcons.external, to: player.value.wta_link },
      player.value.official_link && { label: "Official Website", icon: appIcons.external, color: colour, to: player.value.official_link },
      player.value.wiki_link && { label: "Wikipedia", color: colour, icon: appIcons.external, to: player.value.wiki_link }
    ].filter(Boolean) as { label: string; icon?: string; to?: string; color: "wta" | "atp" | "primary" }[]
  }
  return []
})
</script>

<template>
  <page-wrapper>
    <template #nav-right>
      <div
        v-if="xlAndUp"
        class="flex items-center gap-2"
      >
        <player-buttons
          :id="id as string"
          :name="name as string"
        />
        <u-button
          v-for="button in otherLinks"
          :key="button.label"
          :icon="button.icon"
          :label="button.label"
          :to="button.to"
          size="xs"
          :color="button.color"
        />
      </div>
      <u-dropdown-menu
        v-else
        :items="[...PLAYER_PAGES, ...otherLinks]"
      >
        <u-button
          :icon="icons.layers"
          color="neutral"
          variant="link"
          size="xl"
        />
      </u-dropdown-menu>
    </template>

    <template
      #toolbar
      v-if="$slots.toolbar"
    >
      <slot
        v-if="player"
        name="toolbar"
        :tour="player.tour"
      />
    </template>

    <slot
      v-if="player"
      :country="player?.country"
      :tour="player.tour"
    />
  </page-wrapper>
</template>
