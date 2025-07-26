<script setup lang="ts">
import { PlayerDetailsGrid, PlayerDetailsTable } from "#components"

definePageMeta({ name: "player" })
const playerYears = useState<string[]>("player-years")
const { viewMode } = useViewMode()
const { params } = useRoute()
const { id } = params as { id: string }

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
  <player-wrapper v-slot="{ country, tour, first_name, last_name }">
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
          :color="getTourColor([tour])"
          :label="tour"
        />
      </template>
    </u-page-header>

    <component
      :is="viewMode === 'list' ? PlayerDetailsTable : PlayerDetailsGrid"
      :active="activeYears.active"
      :player
      :status
      :tour
      :first_name
      :last_name
    />
  </player-wrapper>
</template>
