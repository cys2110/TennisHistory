<script setup lang="ts">
import { PlayerStatsGrid, PlayerStatsTable } from "#components"

definePageMeta({ name: "stats", layout: false })
const appConfig = useAppConfig()
const route = useRoute()
const toast = useToast()
const { viewMode } = useViewMode()

const name = computed(() => decodeName(route.params.name as string))
const playerYears = useState<string[]>("player-years")
const years = ref<string[] | undefined>()
const surfaces = ref<SurfaceEnum[] | undefined>()

// API call
const { data: stats, status } = await useFetch<PlayerStatsType[]>("/api/players/stats", {
  query: { id: route.params.id, years, surfaces },
  default: () => [],
  onResponseError: ({ error }) => {
    toast.add({
      title: `Error fetching ${name.value}'s stats`,
      description: error?.message,
      icon: appConfig.ui.icons.error,
      color: "error"
    })
    showError(error!)
  }
})
</script>

<template>
  <div>
    <nuxt-layout name="player">
      <template #toolbar>
        <years-select
          v-if="playerYears.length"
          v-model="years"
          :items="playerYears"
        />
        <surface-select v-model="surfaces" />
        <player-stats-chart
          v-if="stats.length"
          :stats
          :key="JSON.stringify(stats) + 'chart'"
        />
      </template>

      <component
        :is="viewMode === 'cards' ? PlayerStatsGrid : PlayerStatsTable"
        :key="viewMode"
        :stats
        :status
        :years
      />
    </nuxt-layout>
  </div>
</template>
