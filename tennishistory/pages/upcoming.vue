<script setup lang="ts">
definePageMeta({ name: "upcoming", pageTransition: { name: "rotate" } }) // Define name for routing
useHead({ title: "Upcoming Tournaments" }) // Define title for tab title
const toast = useToast()

// Set shortcuts for select menus
defineShortcuts({
  meta_shift_m: () => (months.value.length === MONTH_NAMES.length ? [] : (months.value = MONTH_NAMES)),
  meta_shift_c: () => (categories.value.length === CATEGORIES.length ? (categories.value = []) : (categories.value = CATEGORIES)),
  meta_shift_s: () => (surfaces.value.length === SURFACES.length ? (surfaces.value = []) : (surfaces.value = SURFACES))
})

// Set filter values - default to all
const surfaces = useRouteQuery("surfaces", SURFACES)
const months = useRouteQuery("months", MONTH_NAMES)
const categories = useRouteQuery("categories", CATEGORIES)

// API call
const { data: events, status, error } = await useFetch<EventCardType[]>("/api/upcomingTournaments", { query: { surfaces, months, categories } })

// Anchor links for right sidebar
const links = computed(() => {
  // Computed value rather than useFetch onResponse to avoid hydration mismatch
  if (events.value) {
    return events.value.map(event => ({
      label: event.name,
      to: `#event-${event.eid}`
    }))
  }
  return []
})

// Add toast when error fetching data
whenever(error, () => {
  toast.add({
    title: "Error fetching upcoming tournaments",
    description: `${error.value}`,
    icon: ICONS.error
  })
})
</script>

<template>
  <u-page>
    <u-page-header title="Upcoming Tournaments" />

    <u-page-body>
      <!--Page toolbar (visible on smaller screens)-->
      <u-container class="lg:hidden flex flex-col justify-evenly gap-2">
        <surface-select v-model="surfaces" />
        <month-select v-model="months" />
        <category-select v-model="categories" />
      </u-container>

      <events-grid
        v-if="events && events.length > 0"
        :events
      />
      <loading-event-card v-else-if="status === 'pending'" />
      <error-message
        v-else
        :icon="ICONS['no-calendar']"
      >
        No upcoming events
      </error-message>
    </u-page-body>

    <!--Right sidebar (visible on large+ screens)-->
    <template #right>
      <u-page-aside>
        <div class="text-lg mb-2">Filters</div>
        <div class="flex flex-col gap-2 ml-5">
          <month-select v-model="months" />
          <category-select v-model="categories" />
          <surface-select v-model="surfaces" />
        </div>

        <!--Anchor links - using anchor scroll module for smooth scrolling-->
        <div class="text-lg mt-5 mb-2">On this page</div>
        <anchor-links :links />
      </u-page-aside>
    </template>
  </u-page>
</template>
