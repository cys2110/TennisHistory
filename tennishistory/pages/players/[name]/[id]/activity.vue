<script setup lang="ts">
definePageMeta({
  name: "activity",
  layout: "dashboard-layout"
})
const toast = useToast()
const formatName = useFormatName()
const id = useRouteParams<string>("id")
const startYear = useState<number>("startYear")
const endYear = useState<number>("endYear")
const year = useRouteQuery<string>("year", endYear.value > 0 ? endYear.value.toString() : new Date().getFullYear().toString())
const yearsArray = ref<string[]>(startYear.value > 0 ? Array.from({ length: (endYear.value > 0 ? endYear.value : new Date().getFullYear()) - startYear.value + 1 }, (_, i) => ((endYear.value > 0 ? endYear.value : new Date().getFullYear()) - i).toString()) : [])

// API call
const { data: yearActivity } = await useFetch<PlayerActivityAPIType>("/api/player-activity", {
  query: { id, year },
  onResponseError: error => {
    toast.add({
      title: `Error fetching ${formatName.capitaliseName.value}'s ${year.value} activity`,
      icon: ICONS.error,
      color: "error"
    })
  }
})

// Anchor links
const links = computed(() => {
  if (yearActivity.value && yearActivity.value.activity.length) {
    return yearActivity.value.activity.map(event => ({
      to: `#event-${event.eid}`,
      label: event.name
    }))
  }
})
</script>

<template>
  <player-wrapper>
    <template #toolbar>
      <ClientOnly>
        <year-select
          v-model="year"
          :items="yearsArray"
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
      class="xl:grid-cols-3 2xl:grid-cols-3 2xl:w-1/2 mx-auto"
    >
      <year-stat-card
        v-for="stat in yearActivity.stats"
        :key="stat.category"
        :stats="stat"
      />
    </u-page-grid>

    <u-page-list
      v-if="yearActivity && yearActivity.activity.length > 0"
      class="m-10 gap-10 2xl:w-1/2 mx-auto"
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
      :icon="ICONS['no-calendar']"
      :title="`${formatName.capitaliseName.value} has no activity for ${year}`"
    />
  </player-wrapper>
</template>
