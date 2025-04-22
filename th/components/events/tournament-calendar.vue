<script setup lang="ts">
const { breadcrumbs, type } = defineProps<{
  breadcrumbs: { label: string; to?: { name: string }; icon: string }[]
  type: "upcoming" | "archive"
}>()

// Set select values - default to all
const year = useRouteQuery("year", new Date().getFullYear().toString())
const months = ref<(keyof typeof MonthEnum)[] | undefined>()
const categories = ref<CategoryEnum[] | undefined>()
const surfaces = ref<SurfaceEnum[] | undefined>()

// API call
const { data: events, status } = await useFetch<EventCardType[]>("/api/results-archive", {
  query: { surfaces, months, categories, year, upcoming: type }
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
          v-if="type === 'archive'"
          v-model="year"
        />
        <month-select v-model="months" />
        <category-select v-model="categories" />
        <surface-select v-model="surfaces" />
      </template>

      <!--Event cards-->
      <event-grid
        v-if="events && events.length > 0"
        :events
      />

      <u-page-grid v-else-if="status === 'pending'">
        <event-loading-card
          v-for="_ in 10"
          :key="_"
        />
      </u-page-grid>

      <error-message
        v-else
        title="No upcoming tournaments"
        :icon="ICONS.noCalendar"
        :status
        error="Error fetching upcoming tournaments"
      />
    </nuxt-layout>
  </div>
</template>
