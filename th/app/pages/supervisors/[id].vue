<script setup lang="ts">
import { TournamentCalendarGrid, TournamentCalendarTable } from "#components"

definePageMeta({ name: "supervisor" })
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
const surfaces = ref<SurfaceType[]>()

watch(
  [tours, categories, surfaces, environment, months],
  () => {
    componentKey.value++
  },
  { deep: true }
)

// API calls
const { data } = await useFetch<PersonInterface>("/api/supervisors/overview", {
  query: { id },
  onResponse: ({ response }) => (year.value = response._data[response._data.length - 1])
})

const { data: events, status } = await useFetch<EventInterface[]>("/api/supervisors/details", {
  query: { id, year },
  default: () => []
})

useHead({ title: () => `${data.value?.id ?? capitalCase(id as string)} | Supervisors` })

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
      <u-button
        v-if="data?.labels.includes('Umpire')"
        :to="{ name: 'umpire', params: { id } }"
        :icon="icons.umpire"
        :label="mdAndDown ? undefined : 'Umpire Profile'"
        :size="mdAndDown ? 'xs' : 'sm'"
      />
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
            :filters="['year', 'month', 'tour', 'category', 'surface']"
            v-model:year="year"
            v-model:months="months"
            v-model:tour="tours"
            v-model:categories="categories"
            v-model:surfaces="surfaces"
            v-model:environment="environment"
            :items="data?.years || []"
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
        :filters="['year', 'month', 'tour', 'category', 'surface']"
        v-model:year="year"
        v-model:months="months"
        v-model:tour="tours"
        v-model:categories="categories"
        v-model:surfaces="surfaces"
        v-model:environment="environment"
        :items="data?.years || []"
      />
    </template>

    <u-page-header
      v-if="mdAndDown"
      :title="data?.id"
    />

    <component
      :is="viewMode === 'list' && mdAndUp ? TournamentCalendarTable : TournamentCalendarGrid"
      :events="filteredEvents"
      :status
      :key="`${viewMode}-${componentKey}`"
      :value="data?.id"
    />
  </page-wrapper>
</template>
