<script setup lang="ts">
import { PlayerDetailsGrid, PlayerDetailsTable } from "#components"

definePageMeta({ name: "player" })
const { viewMode } = useViewMode()
const { name, params } = useRoute()
const playerName = computed(() => decodeName(params.name as string))
const currentPage = computed(() => PLAYER_PAGES.find(page => page.name === name))
useHead({ title: currentPage.value?.label ?? "", templateParams: { subPage: playerName.value } })
const playerYears = useState<string[]>("player-years")

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
const { data: player, status } = await useFetch<PlayerDetailsType>("/api/players/details", {
  query: { id: params.id }
})
</script>

<template>
  <player-wrapper v-slot="{ country, tour }">
    <u-page-header
      :title="playerName"
      :description="`Years Active: ${activeYears.activeYears} (${activeYears.numberOfYears} ${activeYears.numberOfYears === 1 ? 'year' : 'years'})`"
      :ui="{ title: 'tracking-wider uppercase' }"
    >
      <template #headline>
        <u-link
          :to="{
            name: 'country',
            params: { id: country.id, name: country.name }
          }"
          class="flex items-center"
        >
          <u-icon
            :name="getFlagCode(country)"
            class="text-2xl"
          />
        </u-link>
        <u-badge
          :color="activeYears.active ? 'active' : 'inactive'"
          :label="activeYears.active ? 'Active' : 'Inactive'"
        />
        <u-badge
          :color="tour === 'WTA' ? 'wta' : 'atp'"
          :label="tour"
        />
      </template>
    </u-page-header>

    <component
      :is="viewMode === 'list' ? PlayerDetailsTable : PlayerDetailsGrid"
      :key="viewMode"
      :player
      :status
      :active="activeYears.active"
      :tour
    />
  </player-wrapper>
</template>
