<script setup lang="ts">
definePageMeta({ name: "upcoming", title: "Upcoming Tournaments" })
useHead({ title: "Upcoming Tournaments" })
const toast = useToast()

// Set select values - default to all
const surfaces = useRouteQuery("surfaces", variables.SURFACES)
const months = useRouteQuery("months", variables.MONTH_NAMES)
const categories = useRouteQuery("categories", variables.CATEGORIES)

// Set shortcuts for select menus
defineShortcuts({
  meta_shift_m: () => (months.value.length === variables.MONTH_NAMES.length ? [] : (months.value = variables.MONTH_NAMES)),
  meta_shift_c: () => (categories.value.length === variables.CATEGORIES.length ? (categories.value = []) : (categories.value = variables.CATEGORIES)),
  meta_shift_s: () => (surfaces.value.length === variables.SURFACES.length ? (surfaces.value = []) : (surfaces.value = variables.SURFACES))
})

// API call
const { data: events } = await useFetch<EventCard[]>("/api/upcomingTournaments", {
  query: { surfaces, months, categories },
  onResponseError({ error }) {
    toast.add({
      title: "Error fetching upcoming tournaments",
      description: error?.message,
      icon: ICONS.error
    })
  }
})

// Anchor links for right sidebar - computed value to avoid hydration mismatch
const links = computed(() => {
  if (events.value) {
    return events.value.map((event: EventCard) => ({
      label: event.name,
      to: `#event-${event.eid}`
    }))
  }
  return []
})
</script>

<template>
  <u-page>
    <u-page-header title="Upcoming Tournaments" />

    <!--Selects for smaller screens-->
    <u-container class="lg:hidden my-5 flex flex-col gap-3">
      <category-select v-model="categories" />
      <month-select v-model="months" />
      <surface-select v-model="surfaces" />
    </u-container>

    <u-page-body>
      <events-grid
        v-if="events && events.length > 0"
        :events
      />
      <error-message
        v-else
        :icon="ICONS['no-calendar']"
        title="No upcoming tournaments"
      />
    </u-page-body>

    <!--Right sidebar (visible on larger screens)-->
    <template #right>
      <u-page-aside>
        <u-container>
          <div class="text-lg mb-2 text-slate-400 font-semibold">Filters</div>
          <div class="flex flex-col gap-3">
            <category-select v-model="categories" />
            <month-select v-model="months" />
            <surface-select v-model="surfaces" />
          </div>
        </u-container>

        <!--Anchor links - using anchor scroll module for smooth scrolling-->
        <u-container>
          <div class="text-lg mb-2 mt-5 text-slate-400 font-semibold">On this page</div>
          <anchor-links :links />
        </u-container>
      </u-page-aside>
    </template>
  </u-page>
</template>
