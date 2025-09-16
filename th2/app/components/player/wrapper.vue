<script setup lang="ts">
const {
  icons,
  ui: { icons: appIcons }
} = useAppConfig()
const { name, params } = useRoute()
const { id, name: paramName } = params as { id: string; name: string }

// API call
const { data } = await useFetch<PlayerInterface>(() => "/api/players/overview", {
  query: { id }
})

// Set state for other player components
const playerYears = useState<number[]>("player-years", () => data.value?.years || [])
const playerName = useState<string>("player-name", () => (data.value ? `${data.value.first_name} ${data.value.last_name}` : ""))

useHead({
  title: `${PLAYER_PAGES.find(page => page.name === name)?.label} | ${data.value ? `${data.value.first_name} ${data.value.last_name}` : capitalCase(paramName)}`
})

const otherLinks = computed(() => {
  if (data.value) {
    const player = data.value
    const colour = player.tour.toLowerCase() as "wta" | "atp" | "primary"
    return [
      player.coach && {
        label: "Coach Profile",
        icon: icons.coach,
        to: { name: "coach", params: { id } }
      },
      player.atp_link && { label: "ATP Profile", color: colour, to: player.atp_link, target: "_blank" },
      player.wta_link && { label: "WTA Profile", color: colour, to: player.wta_link, target: "_blank" },
      player.official_link && { label: "Official Website", color: colour, to: player.official_link, target: "_blank" },
      player.wiki_link && { label: "Wikipedia", color: colour, to: player.wiki_link, target: "_blank" }
    ].filter(Boolean) as { label: string; icon?: string; to?: string; color: "wta" | "atp" | "primary"; target?: string }[]
  }
  return []
})
</script>

<template>
  <page-wrapper>
    <template #nav-right>
      <!--@vue-expect-error-->
      <u-dropdown-menu :items="[...PLAYER_PAGES.map(page => ({ ...page, to: { name: page.name, params: { id, name: paramName } } })), ...otherLinks]">
        <u-button
          :icon="appIcons.ellipsis"
          variant="link"
          size="xl"
          :ui="{ leadingIcon: 'rotate-90' }"
        />
      </u-dropdown-menu>
    </template>

    <template
      #toolbar
      v-if="$slots.toolbar"
    >
      <slot
        v-if="data"
        name="toolbar"
        :tour="data.tour"
        :country="data.country"
        :first_name="data.first_name"
        :last_name="data.last_name"
      />
    </template>

    <slot
      v-if="data"
      :country="data.country"
      :tour="data.tour"
      :first_name="data.first_name"
      :last_name="data.last_name"
    />
  </page-wrapper>
</template>
