<script setup lang="ts">
import { UmpireMatchGrid, UmpireMatchTable } from "#components"

definePageMeta({ name: "umpire" })
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
  [year, tours, categories, surfaces, environment, months],
  () => {
    componentKey.value++
  },
  { deep: true }
)

// API calls
const { data } = await useFetch<PersonInterface>("/api/umpires/overview", {
  query: { id },
  onResponse: ({ response }) => (year.value = response._data[response._data.length - 1])
})

const { data: events, status } = await useFetch<UmpireAPIType[]>("/api/umpires/details", {
  key: `umpire-events-${id}`,
  query: { id },
  default: () => []
})

useHead({ title: () => data.value?.id, templateParams: { subPage: "Umpires" } })

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
      label: `${event.tournament.name} ${event.year}`,
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
        v-if="data?.labels.includes('Supervisor')"
        :to="{ name: 'supervisor', params: { id } }"
        :icon="icons.supervisor"
        :label="mdAndDown ? undefined : 'Supervisor Profile'"
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

    <component
      :is="viewMode === 'list' && mdAndUp ? UmpireMatchTable : UmpireMatchGrid"
      :events="filteredEvents"
      :status
      :key="`${viewMode}-${componentKey}`"
      :first-name="data?.first_name ?? ''"
      :last-name="data?.last_name ?? ''"
    />
  </page-wrapper>
</template>
