<script setup lang="ts">
import { TournamentCalendarGrid, TournamentCalendarTable } from "#components"

definePageMeta({ name: "surface" })
const { params } = useRoute()
const { id } = params as { id: string }
const { icons } = useAppConfig()
const { viewMode } = useViewMode()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1280 })
const mdAndUp = breakpoints.greaterOrEqual("md")
const mdAndDown = breakpoints.smallerOrEqual("md")
const componentKey = ref(0)

const tours = ref<TourType[]>()
const year = useRouteQuery("year", new Date().getFullYear().toString())
const months = ref<MonthType[]>()
const categories = ref<CategoryType[]>()
const environment = ref<EnvironmentType[]>()

watch(
  [tours, categories, environment, months],
  () => {
    componentKey.value++
  },
  { deep: true }
)

// API calls
const { data: events, status } = await useFetch<EventInterface[]>("/api/surfaces/details", {
  query: { id: capitalCase(id as string), year },
  default: () => []
})

useHead({ title: () => `${capitalCase(id as string)} | Surfaces` })

const filteredEvents = computed(() =>
  events.value.filter(event => {
    if (
      (tours.value && tours.value.length > 0 && !event.tours.some(tour => tours.value?.includes(tour))) ||
      (categories.value &&
        categories.value.length > 0 &&
        [event.category, event.atp_category, event.wta_category, event.men_category, event.women_category].some(
          category => category && !categories.value?.includes(category)
        )) ||
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
            :filters="['all-years', 'month', 'tour', 'category']"
            v-model:year="year"
            v-model:months="months"
            v-model:tour="tours"
            v-model:categories="categories"
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
        :filters="['all-years', 'month', 'tour', 'category']"
        v-model:year="year"
        v-model:months="months"
        v-model:tour="tours"
        v-model:categories="categories"
        v-model:environment="environment"
      />
    </template>

    <component
      :is="viewMode === 'list' && mdAndUp ? TournamentCalendarTable : TournamentCalendarGrid"
      :events="filteredEvents"
      :status
      :key="`${viewMode}-${componentKey}`"
      :value="capitalCase(id as string)"
    />
  </page-wrapper>
</template>
