<script setup lang="ts">
definePageMeta({ name: "activity", layout: "player-layout" })
const route = useRoute()
const toast = useToast()
const year = ref<string>(new Date().getFullYear().toString())
const yearsArray = ref<string[]>([])
const links = ref<{ label: string; to: string }[]>([])

const { status: yearsStatus } = await useFetch<{ start: { low: number; high: number }; end: { low: number; high: number } }>("/api/playerActiveYears", {
  query: { id: route.params.id },
  onResponse: ({ response }) => {
    yearsArray.value = Array.from({ length: response._data.end.low - response._data.start.low + 1 }, (_, index) => (response._data.start.low + index).toString())
    year.value = response._data.end.low.toString()
  },
  onResponseError: () => {
    toast.add({
      title: "Error fetching data",
      icon: ICONS.error
    })
  }
})

const { data: stats, status: statsStatus } = await useFetch<{ category: string; value: string }[]>("/api/playerYearStats", {
  query: { id: route.params.id, year },
  onResponseError: () => {
    toast.add({
      title: "Error fetching data",
      icon: ICONS.error
    })
  }
})

const { data: events, status } = await useFetch<PlayerActivityType[]>("/api/playerActivity", {
  query: { id: route.params.id, year },
  onResponse: ({ response }) => {
    links.value = response._data.map((event: PlayerActivityType) => ({
      label: event.name,
      to: `#${event.eid}`
    }))
  },
  onResponseError: () => {
    toast.add({
      title: "Error fetching data",
      icon: ICONS.error
    })
  }
})
</script>

<template>
  <u-page>
    <u-page-body>
      <!--TODO: Skeleton loaders for stats and activity cards-->
      <ClientOnly>
        <u-page-grid v-if="stats">
          <u-page-card
            v-for="stat in stats"
            :key="stat.category"
            :title="stat.category"
            :description="stat.value"
          />
        </u-page-grid>
        <u-page-list v-if="events">
          <activity-card
            v-for="event in events"
            :key="event.eid"
            :event
            :year="year"
          />
        </u-page-list>
        <error-message
          v-else
          :icon="ICONS['no-calendar']"
        >
          {{ useChangeCase(route.params.name as string, "capitalCase").value }}'s activity is not available
        </error-message>
      </ClientOnly>
    </u-page-body>

    <template #right>
      <u-page-aside>
        <ClientOnly>
          <u-container>
            <u-select
              v-model="year"
              :items="yearsArray"
              :icon="ICONS.calendar"
              class="w-full"
            />
          </u-container>
          <u-page-anchors :links />
        </ClientOnly>
      </u-page-aside>
    </template>
  </u-page>
</template>
