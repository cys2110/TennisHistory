<script setup lang="ts">
definePageMeta({ name: "venue" })
const {
  // @ts-ignore
  params: { id }
} = useRoute()
const { viewMode } = useDefaults()
const { icons } = useAppConfig()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1024 })
const mdAndDown = breakpoints.smallerOrEqual("md")
const lg = breakpoints.smallerOrEqual("lg")
const componentKey = ref(0)

const year = useRouteQuery("year", new Date().getFullYear(), { transform: Number })
const tours = ref<TourType[]>()
const months = ref<MonthType[]>()
const categories = ref<CategoryType[]>()
const environment = ref<EnvironmentType[]>()
const surfaces = ref<SurfaceType[]>()

// Force re-rendering of the component when filters change
watch(
  [tours, categories, surfaces, environment, months],
  () => {
    componentKey.value++
  },
  { deep: true }
)

// API call
const { data: venue } = await useFetch<VenueInterface>("/api/venues/overview", {
  key: `venue-overview-${id}`,
  query: { id }
})

const { data: events, status } = await useFetch<EventInterface[]>("/api/venues/details", {
  key: `venues-details-${id}-${year}`,
  query: { id, year },
  default: () => []
})

useJsonld(() => ({
  "@context": "https://schema.org",
  "@type": "TennisComplex",
  name: venue.value?.name ?? capitalCase(id as string),
  description: "Tournament venue",
  containedInPlace: {
    "@type": "City",
    name: venue.value?.city ?? "Unknown City",
    containedInPlace: {
      "@type": "Country",
      name: venue.value?.country.name ?? "Unknown Country"
    }
  }
}))

useHead({
  title: () => `${venue.value?.id ?? capitalCase(id as string)} | Venues`
})

const filteredEvents = computed(() =>
  events.value.filter(event => {
    if (
      (tours.value?.length && !event.tours.some(tour => tours.value?.includes(tour))) ||
      (categories.value?.length &&
        [event.category, event.atp_category, event.wta_category, event.men_category, event.women_category].some(
          category => category && !categories.value?.includes(category)
        )) ||
      (surfaces.value?.length && (!event.surface || !surfaces.value.includes(event.surface.surface))) ||
      (environment.value?.length && (!event.surface || !environment.value.includes(event.surface.environment))) ||
      (months.value?.length &&
        [
          event.start_date?.month,
          event.atp_start_date?.month,
          event.wta_start_date?.month,
          event.men_start_date?.month,
          event.women_start_date?.month
        ].some(month => month && !months.value?.includes(MONTHS[month - 1]!)))
    )
      return false
    return true
  })
)

// TOC
const toc = computed(() => [
  {
    id: "events",
    items: filteredEvents.value.map(event => ({
      label: event.tournament.name,
      to: `#event-${event.id}`
    }))
  }
])
</script>

<template>
  <div class="w-full">
    <u-dashboard-panel>
      <template #header>
        <u-dashboard-navbar>
          <template #title>
            <page-title />
          </template>

          <template #right>
            <u-slideover
              v-if="mdAndDown && viewMode !== 'list'"
              title="Filters"
              class="ml-auto"
            >
              <u-button
                :icon="icons.filter"
                size="xs"
              />

              <template #body>
                <filter-select-all-years v-model="year" />
                <filter-select-months v-model="months" />
                <filter-checkbox-tours v-model="tours" />
                <filter-select-categories
                  v-model="categories"
                  v-model:tour="tours"
                />
                <filter-checkbox-surfaces
                  v-model="surfaces"
                  v-model:environment="environment"
                />
              </template>
            </u-slideover>
            <u-popover v-if="viewMode !== 'list'">
              <u-button
                :size="mdAndDown ? 'xs' : 'sm'"
                :icon="icons.toc"
              />
              <template #content>
                <u-command-palette
                  placeholder="Search events"
                  :groups="toc"
                  :loading="status === 'pending'"
                  :fuse="{ resultLimit: 200 }"
                  :ui="{ content: 'max-h-80', root: 'border border-primary rounded-lg' }"
                />
              </template>
            </u-popover>
          </template>
        </u-dashboard-navbar>

        <u-dashboard-toolbar v-if="!mdAndDown && viewMode !== 'list'">
          <filter-select-all-years v-model="year" />
          <filter-select-months v-model="months" />
          <filter-select-tours
            v-if="lg"
            v-model="tours"
          />
          <filter-checkbox-tours
            v-else
            v-model="tours"
          />
          <filter-select-categories
            v-model="categories"
            v-model:tour="tours"
          />
          <filter-select-surfaces
            v-if="lg"
            v-model="surfaces"
            v-model:environment="environment"
          />
          <filter-checkbox-surfaces
            v-else
            v-model="surfaces"
            v-model:environment="environment"
          />
        </u-dashboard-toolbar>
      </template>

      <template #body>
        <event-table
          v-if="viewMode === 'list'"
          v-model="year"
          :events
          :status
        />

        <u-page-grid
          v-else-if="events.length || status === 'pending'"
          class="xl:grid-cols-4 2xl:grid-cols-5 p-5 scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent overflow-y-auto scroll-smooth"
        >
          <event-card
            v-if="events.length"
            v-for="event in filteredEvents"
            :key="event.id"
            :event
          />

          <loading-event
            v-else
            v-for="_ in 10"
            :key="_"
          />
        </u-page-grid>

        <error-message
          v-else
          :message="`Noo events took place at ${venue?.name ? `${venue.name}, ${venue.city}` : (venue?.city ?? capitalCase(id as string))} in ${year}.`"
        />
      </template>

      <template
        #footer
        v-if="viewMode !== 'list'"
      >
        <div class="font-semibold p-5 border-t border-muted">Total: {{ filteredEvents.length }}</div>
      </template>
    </u-dashboard-panel>
  </div>
</template>
