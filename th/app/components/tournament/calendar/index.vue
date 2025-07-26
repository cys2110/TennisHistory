<script setup lang="ts">
import { TournamentCalendarGrid, TournamentCalendarTable } from "#components"
const { name } = useRoute()
const { icons } = useAppConfig()
const { viewMode } = useViewMode()
const { tableMode } = useDefaultTable()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1280 })
const mdAndUp = breakpoints.greaterOrEqual("md")
const mdAndDown = breakpoints.smallerOrEqual("md")
const componentKey = ref(0)

// Filters
const filters = computed(() => {
  const allFilters: SelectType[] = ["all-years", "month", "tour", "category", "surface"]
  if (name === "results-archive") {
    return allFilters
  } else {
    return allFilters.filter(filter => filter !== "all-years" && filter !== "month")
  }
})

const tours = ref<TourType[]>()
const year = useRouteQuery("year", new Date().getFullYear().toString())
const months = ref<MonthType[]>()
const categories = ref<CategoryType[]>()
const environment = ref<EnvironmentType[]>()
const surfaces = ref<SurfaceType[]>()

watch(
  [tours, categories, surfaces, environment, months],
  () => {
    componentKey.value++
  },
  { deep: true }
)

// API calls
const { data: counts } = await useFetch<{ tours: TourType[]; categories: CategoryType[] }[]>("/api/events/counts", { query: { year } })

const { data: events, status } = await useFetch<EventInterface[]>("/api/results-archive", {
  key: `${name as string}-${year.value}`,
  query: { year, upcoming: name === "upcoming-tournaments" },
  default: () => []
})

const filteredEvents = computed(() =>
  events.value.filter(event => {
    if (
      (tours.value && tours.value.length > 0 && !event.tours.some(tour => tours.value?.includes(tour))) ||
      (categories.value &&
        categories.value.length > 0 &&
        [event.category, event.atp_category, event.wta_category, event.men_category, event.women_category].some(
          category => category && !categories.value?.includes(category)
        )) ||
      (surfaces.value && surfaces.value.length > 0 && (!event.surface || !surfaces.value.includes(event.surface.surface))) ||
      (environment.value && environment.value.length > 0 && (!event.surface || !environment.value.includes(event.surface.environment))) ||
      (months.value &&
        months.value.length > 0 &&
        [
          event.start_date?.month,
          event.atp_start_date?.month,
          event.wta_start_date?.month,
          event.men_start_date?.month,
          event.women_start_date?.month
        ].some(month => month && !months.value?.includes(MONTHS[month - 1]!)))
    ) {
      return false
    }
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
    <!--Filters-->
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
          <filter-combined
            :filters
            v-model:year="year"
            v-model:months="months"
            v-model:tour="tours"
            v-model:categories="categories"
            v-model:surfaces="surfaces"
            v-model:environment="environment"
          />
        </template>
      </u-slideover>
      <u-popover v-if="viewMode === 'cards' || mdAndDown">
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
      <filter-combined
        :filters
        v-model:year="year"
        v-model:months="months"
        v-model:tour="tours"
        v-model:categories="categories"
        v-model:surfaces="surfaces"
        v-model:environment="environment"
      />
    </template>

    <!--Event totals-->
    <event-counts
      v-if="name === 'results-archive' && counts && (viewMode !== 'list' || tableMode === 'ungrouped')"
      :counts
    />

    <component
      :is="viewMode === 'list' && mdAndUp ? TournamentCalendarTable : TournamentCalendarGrid"
      :events="filteredEvents"
      :status
      :key="componentKey"
    />
  </page-wrapper>
</template>
