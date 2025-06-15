<script setup lang="ts">
import { PlayerStatsGrid, PlayerStatsTable } from "#components"

definePageMeta({ name: "stats" })
const { icons } = useAppConfig()
const { viewMode } = useViewMode()

const { name, params } = useRoute()
const playerName = computed(() => decodeName(params.name as string))
const currentPage = computed(() => PLAYER_PAGES.find(page => page.name === name))
useHead({ title: currentPage.value?.label ?? "", templateParams: { subPage: playerName.value } })
const playerYears = useState<string[]>("player-years")

const years = ref<string[] | undefined>()
const surfaces = ref<SurfaceType[] | undefined>()
const environment = ref<EnvironmentType | undefined>()
const draw = ref<"Main" | "Qualifying" | undefined>("Main")
const level = ref<"ITF" | "Challenger" | "Tour" | undefined>("Tour")

// API call
const { data: stats, status } = await useFetch<PlayerStatsType[]>("/api/players/stats", {
  query: { id: params.id, years, surfaces, environment, draw, level },
  default: () => []
})
</script>

<template>
  <player-wrapper>
    <template #toolbar="{ tour }">
      <select-years
        v-if="playerYears.length"
        v-model="years"
        :items="playerYears"
      />
      <select-surface
        v-model="surfaces"
        v-model:environment="environment"
      />
      <select-draw v-model="draw" />
      <select-level v-model="level" />
      <player-stats-chart
        v-if="stats.length"
        :stats
        :key="JSON.stringify(years) + 'chart'"
        :tour
      />
    </template>

    <template #default="{ tour }">
      <component
        :is="viewMode === 'cards' ? PlayerStatsGrid : PlayerStatsTable"
        :key="viewMode"
        :stats
        :status
        :years
        :tour
      />
    </template>
  </player-wrapper>
</template>
