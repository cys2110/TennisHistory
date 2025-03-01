<script setup lang="ts">
definePageMeta({ name: "activity", layout: "player-layout" })
const toast = useToast()
const formatName = useFormatName()
const id = useRouteParams<string>("id")
const lastYear = useState<string>("lastYear")
const year = useRouteQuery<string>("year", lastYear.value)
const yearsArray = useState<string[]>("yearsArray")

// API call
const { data: events } = await useFetch<PlayerYearType>("/api/playerActivity", {
  query: { id, year },
  onResponseError: error => {
    toast.add({
      title: "Error fetching player's activity",
      icon: ICONS.error,
      description: error.error?.message
    })
  }
})

// Sidebar links - computed to avoid hydration mismatch
const links = computed(() => {
  if (events.value) {
    return events.value.activity.map((event: PlayerActivityType) => ({
      label: event.name,
      to: `#${event.eid}`
    }))
  }
  return []
})
</script>

<template>
  <u-page>
    <u-page-body>
      <u-container>
        <u-form-field label="Year">
          <u-select
            v-model="year"
            :items="yearsArray"
            :icon="ICONS.calendar"
            class="w-full"
            variant="none"
          />
        </u-form-field>
      </u-container>

      <u-container v-if="events">
        <u-page-grid class="xl:!grid-cols-3">
          <u-page-card
            v-for="stat in events.stats"
            :key="stat.category"
            :title="stat.category"
            :description="stat.value"
            highlight
          />
        </u-page-grid>

        <u-page-list class="my-10 gap-10">
          <activity-card
            v-for="event in events.activity"
            :key="event.eid"
            :event
            :year
          />
        </u-page-list>
      </u-container>
      <error-message
        v-else
        :icon="ICONS['no-calendar']"
        :title="`${formatName.capitaliseName.value}'s activity is not available`"
      />
    </u-page-body>

    <template #right>
      <u-page-aside v-if="links.length > 0">
        <div>On this page</div>
        <anchor-links :links />
      </u-page-aside>
    </template>
  </u-page>
</template>
