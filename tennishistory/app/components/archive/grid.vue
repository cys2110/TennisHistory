<script setup lang="ts">
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
const { data: events, status } = await useFetch<EventInterface[]>("/api/results-archive", {
  key: `results-archive`,
  query: { year },
  default: () => []
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
  <page-wrapper>
    <template #nav-right>
      <u-slideover
        v-if="mdAndDown"
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
      <u-popover>
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

    <template
      #toolbar
      v-if="!mdAndDown"
    >
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
    </template>

    <event-counts :events="filteredEvents" />

    <u-page-grid
      v-if="events.length || status === 'pending'"
      class="xl:grid-cols-4 2xl:grid-cols-5 my-5 p-2 overflow-y-auto scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent gap-3 md:gap-8 scroll-smooth min-h-180 lg:min-h-150 xl:min-h-160 2xl:min-h-180"
    >
      <archive-card
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
      :icon="icons.noCalendar"
      message="No events found"
    />
  </page-wrapper>
</template>
