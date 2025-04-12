<script setup lang="ts">
definePageMeta({ name: "activity" })
const paramName = useRouteParams<string>("name")
const name = computed(() => decodeName(paramName.value))
const id = useRouteParams<string>("id")
const playerYears = useState<number[]>("player-years")
const currentYear = new Date().getFullYear()
const year = useRouteQuery<number>("year", playerYears.value ? playerYears.value[playerYears.value.length - 1] : currentYear)

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
        <ClientOnly>
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
        </ClientOnly>
      </template>
      <u-page-grid
        v-if="yearActivity"
        class="grid-cols-3 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 2xl:w-1/2 mx-auto"
      >
        <year-stat-card
          v-for="stat in yearActivity.stats"
          :key="stat.category"
          :stats="stat"
        />
      </u-page-grid>
      <u-page-list
        v-if="yearActivity && yearActivity.activity.length > 0"
        class="m-10 gap-10 w-full 2xl:w-1/2 mx-auto"
      >
        <activity-card
          v-for="event in yearActivity.activity"
          :key="event.eid"
          :id="`event-${event.eid}`"
          :event
          :year
        />
      </u-page-list>
      <error-message
        v-else
        :icon="ICONS.noCalendar"
        :title="`${name} has no activity for ${year}`"
        :status="status"
        :error="`Error fetching ${name}'s ${year} activity`"
      />
    </nuxt-layout>
  </div>
</template>
