<script setup lang="ts">
definePageMeta({ name: "activity" })
const appConfig = useAppConfig()
const route = useRoute()
const toast = useToast()
const name = computed(() => decodeName(route.params.name as string))

const playerYears = useState<string[]>("player-years")
const currentYear = new Date().getFullYear()
const year = useRouteQuery<string>(
  "year",
  playerYears.value
    ? playerYears.value[playerYears.value.length - 1].toString()
    : currentYear.toString()
)

interface APIResponseInterface {
  stats: PlayerStatsType[]
  activity: PlayerActivityType[]
}

// API call
const { data: yearActivity, status } = await useFetch<APIResponseInterface>(
  "/api/players/activity",
  {
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
  }
)

// Anchor links
const links = computed(() => {
  if (yearActivity.value)
    return yearActivity.value.activity.map(event => ({
      to: `#event-${event.id}`,
      label: event.tournament.name
    }))
})
</script>

<template>
  <div>
    <nuxt-layout name="player-layout">
      <template #toolbar>
        <year-select
          v-model="year"
          :items="playerYears"
        />
        <u-dropdown-menu
          v-if="yearActivity"
          :items="links"
        >
          <u-button
            :icon="ICONS.toc"
            color="neutral"
            variant="link"
            size="xl"
            class="justify-self-end"
          />
        </u-dropdown-menu>
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
        <year-stat-loading-card
          v-else
          v-for="_ in 3"
          :key="_"
        />
      </u-page-grid>

      <u-page-list
        v-if="yearActivity.activity.length > 0 || ['pending', 'idle'].includes(status)"
        class="m-10 gap-10 w-full xl:w-2/3 2xl:w-1/2 mx-auto"
      >
        <activity-card
          v-if="yearActivity.activity.length"
          v-for="event in yearActivity.activity"
          :key="event.id"
          :id="`event-${event.id}`"
          :event
          :year
        />
        <activity-loading-card
          v-else
          v-for="_ in 3"
          :key="_"
        />
      </u-page-list>

      <error-message
        v-else
        :title="`${name} had no activity in ${year}`"
        :icon="ICONS.noCalendar"
      />
    </nuxt-layout>
  </div>
</template>
