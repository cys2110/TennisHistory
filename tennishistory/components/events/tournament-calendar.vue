<script setup lang="ts">
defineProps<{ breadcrumbs: { label: string; to?: { name: string }; icon: string }[] }>()
const route = useRoute()
const toast = useToast()
const appConfig = useAppConfig()

// Set select values - default to all
const year = useRouteQuery("year", new Date().getFullYear().toString())
const months = ref<(keyof typeof MonthEnum)[] | undefined>()
const categories = ref<CategoryEnum[] | undefined>()
const surfaces = ref<SurfaceEnum[] | undefined>()

// API call
const { data: events, status } = await useFetch<EventCardType[]>("/api/results-archive", {
  query: { surfaces, months, categories, year, upcoming: route.name === "upcoming-tournaments" },
  default: () => [],
  onResponseError: ({ error }) => {
    toast.add({
      title:
        route.name === "upcoming-tournaments"
          ? "Error fetching upcoming tournaments"
          : `Error fetching tournaments for ${year}`,
      description: error?.message,
      icon: appConfig.ui.icons.error,
      color: "error"
    })
    showError(error!)
  }
})

// Anchor links
const links = computed(() => {
  if (events.value)
    return events.value.map(event => ({
      to: "#event-" + event.id,
      label: event.tournament.name
    }))
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
          />
        </u-dropdown-menu>
      </template>

      <!--Select menus-->
      <template #toolbar>
        <all-years-select
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
          :key="event.id"
          :event
          :id="`event-${event.id}`"
        />

        <!--Loading state-->
        <event-loading-card
          v-else
          v-for="_ in 10"
          :key="_"
        />
      </u-page-grid>

      <!--If no events are returned-->
      <error-message
        v-else
        :title="
          route.name === 'upcoming-tournaments'
            ? 'No upcoming tournaments'
            : `No tournaments for ${year}`
        "
        :icon="ICONS.noCalendar"
      />
    </nuxt-layout>
  </div>
</template>
