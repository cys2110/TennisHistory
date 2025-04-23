<script setup lang="ts">
defineProps<{ breadcrumbs: { label: string; to?: { name: string }; icon: string }[] }>()
const toast = useToast()
const route = useRoute()

// Set select values - default to all
const year = useRouteQuery("year", new Date().getFullYear().toString())
const months = ref<(keyof typeof MonthEnum)[] | undefined>()
const categories = ref<CategoryEnum[] | undefined>()
const surfaces = ref<SurfaceEnum[] | undefined>()

// API call
const { data: events, status } = await useFetch<EventCardType[]>("/api/results-archive", {
  query: { surfaces, months, categories, year, upcoming: route.name === "upcoming-tournaments" ? "upcoming" : "archive" },
  default: () => [],
  onResponseError: ({ error }) => {
    toast.add({
      title: route.name === "upcoming-tournaments" ? "Error fetching upcoming tournaments" : `Error fetching tournaments for ${year}`,
      description: error?.message,
      icon: ICONS.error,
      color: "error"
    })
  }
})

// Anchor links
const links = computed(() => {
  if (events.value) return events.value.map(event => ({ to: "#event-" + event.eid, label: event.name }))
})
</script>

<template>
  <div>
    <nuxt-layout name="default">
      <template #title>
        <u-breadcrumb :items="breadcrumbs" />
      </template>

      <!--TOC-->
      <template #right>
        <u-dropdown-menu :items="links">
          <u-button
            :icon="ICONS.toc"
            color="neutral"
            variant="link"
            class="cursor-pointer"
          />
        </u-dropdown-menu>
      </template>

      <!--Select menus-->
      <template #toolbar>
        <years-all-select
          v-if="route.name === 'results-archive'"
          v-model="year"
        />
        <month-select v-model="months" />
        <category-select v-model="categories" />
        <surface-select v-model="surfaces" />
      </template>

      <u-page-grid v-if="events.length || ['pending', 'idle'].includes(status)">
        <!--Event cards-->
        <event-card
          v-if="events.length"
          v-for="event in events"
          :key="event.eid"
          :event
          :id="`event-${event.eid}`"
        />

        <!--Loading state-->
        <event-loading-card
          v-else
          v-for="_ in 10"
          :key="_"
        />
      </u-page-grid>

      <!--If no events are returned / error-->
      <error-message
        v-else
        :title="route.name === 'upcoming-tournaments' ? 'No upcoming tournaments' : `No tournaments took place in ${year}`"
        :icon="ICONS.noCalendar"
        :status
        :error="route.name === 'upcoming-tournaments' ? 'upcoming tournaments' : `tournaments for ${year}`"
      />
    </nuxt-layout>
  </div>
</template>
