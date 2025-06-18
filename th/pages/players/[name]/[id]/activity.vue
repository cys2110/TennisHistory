<script setup lang="ts">
import { PlayerActivityGrid, PlayerActivityTable } from "#components"

definePageMeta({ name: "activity" })
const { viewMode } = useViewMode()

const { name, params } = useRoute()
const playerName = computed(() => decodeName(params.name as string))
const currentPage = computed(() => PLAYER_PAGES.find(page => page.name === name))
useHead({ title: currentPage.value?.label ?? "", templateParams: { subPage: playerName.value } })

const playerYears = useState<string[]>("player-years")
const currentYear = new Date().getFullYear()
const year = useRouteQuery<string>("year", playerYears.value ? playerYears.value[playerYears.value.length - 1].toString() : currentYear.toString())
const selectedTab = ref<"Singles" | "Doubles">("Singles")

const apiRoute = computed(() => (selectedTab.value === "Singles" ? "singles-activity" : "doubles-activity"))

// API call
const { data: yearActivity, status } = await useFetch<APIPlayerActivityResponseType>(() => `/api/players/${apiRoute.value}`, {
  query: { id: params.id, year, type: selectedTab },
  default: () => ({ stats: [], activity: [] })
})
</script>

<template>
  <player-wrapper>
    <template #toolbar>
      <select-year
        v-model="year"
        :items="playerYears"
      />

      <u-tabs
        v-model="selectedTab"
        :items="[
          { label: 'Singles', value: 'Singles' },
          { label: 'Doubles', value: 'Doubles' }
        ]"
        variant="link"
      />
    </template>

    <template #default="{ tour }">
      <u-page-grid
        v-if="yearActivity.stats.length || ['pending', 'idle'].includes(status)"
        class="grid-cols-3 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 2xl:w-2/3 mx-auto"
      >
        <details-card
          v-if="yearActivity"
          v-for="stat in yearActivity.stats"
          :key="stat.category"
          :detail="{ title: stat.category, value: stat.value.toString() }"
          :tour
        />
        <loading-base
          v-else
          v-for="_ in 3"
          :key="_"
        />
      </u-page-grid>

      <component
        :is="viewMode === 'list' ? PlayerActivityTable : PlayerActivityGrid"
        :key="viewMode"
        :activity="yearActivity.activity"
        :year
        :status
        :tour
        :type="selectedTab"
      />
    </template>
  </player-wrapper>
</template>
