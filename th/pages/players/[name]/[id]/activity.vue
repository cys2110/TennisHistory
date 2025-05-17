<script setup lang="ts">
import { ActivityGrid, ActivityTable } from "#components"

definePageMeta({ name: "activity" })
const appConfig = useAppConfig()
const route = useRoute()
const toast = useToast()
const { viewMode } = useViewMode()

const name = computed(() => decodeName(route.params.name as string))
const playerYears = useState<string[]>("player-years")
const currentYear = new Date().getFullYear()
const year = useRouteQuery<string>("year", playerYears.value ? playerYears.value[playerYears.value.length - 1].toString() : currentYear.toString())

type APIResponseType = {
  stats: PlayerStatsType[]
  activity: PlayerActivityType[]
}

// API call
const { data: yearActivity, status } = await useFetch<APIResponseType>("/api/players/activity", {
  query: { id: route.params.id, year },
  default: () => ({ stats: [], activity: [] }),
  onResponseError: ({ error }) => {
    toast.add({
      title: `Error fetching ${name.value}'s ${year} activity`,
      description: error?.message,
      icon: appConfig.ui.icons.error,
      color: "error"
    })
    showError(error!)
  }
})
</script>

<template>
  <player-wrapper>
    <template #toolbar>
      <year-select
        v-model="year"
        :items="playerYears"
      />
    </template>

    <!--Overview stats for the year-->
    <u-page-grid
      v-if="yearActivity.stats.length || ['pending', 'idle'].includes(status)"
      class="grid-cols-3 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 2xl:w-1/2 mx-auto"
    >
      <year-stat-card
        v-if="yearActivity"
        v-for="stat in yearActivity.stats"
        :key="stat.category"
        :stats="stat"
      />
      <base-loading-card
        v-else
        v-for="_ in 3"
        :key="_"
      />
    </u-page-grid>
    <component
      :is="viewMode === 'cards' ? ActivityGrid : ActivityTable"
      :key="viewMode"
      :activity="yearActivity.activity"
      :year
      :status
    />
  </player-wrapper>
</template>
