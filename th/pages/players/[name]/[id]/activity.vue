<script setup lang="ts">
definePageMeta({ name: "activity" })
const paramName = useRouteParams<string>("name")
const name = computed(() => decodeName(paramName.value))
const id = useRouteParams<string>("id")
const playerYears = useState<string[]>("player-years")
const currentYear = new Date().getFullYear()
const year = useRouteQuery<string>("year", playerYears.value ? playerYears.value[playerYears.value.length - 1].toString() : currentYear.toString())

// API call
const { data: yearActivity, status } = await useFetch<PlayerActivityAPIType>("/api/player-activity", { query: { id, year } })

// Anchor links
const links = computed(() => {
  if (yearActivity.value)
    return yearActivity.value.activity.map(event => ({
      to: `#event-${event.eid}`,
      label: event.name
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
      <u-page-grid class="grid-cols-3 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 2xl:w-1/2 mx-auto">
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
        v-if="(yearActivity && yearActivity.activity.length > 0) || status === 'pending'"
        class="m-10 gap-10 w-full 2xl:w-1/2 mx-auto"
      >
        <activity-card
          v-if="yearActivity"
          v-for="event in yearActivity.activity"
          :key="event.eid"
          :id="`event-${event.eid}`"
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
        :error="`Error fetching ${name}'s ${year} activity'`"
        :status
      />
    </nuxt-layout>
  </div>
</template>
