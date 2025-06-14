<script setup lang="ts">
import { TournamentCalendarGrid, TournamentCalendarTable } from "#components"

definePageMeta({ name: "supervisor" })
const { viewMode } = useViewMode()
const { icons } = useAppConfig()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1280 })
const mdAndDown = breakpoints.smallerOrEqual("md")

const { params } = useRoute()
const name = computed(() => decodeName(params.id as string))
useHead({ title: () => name.value, templateParams: { subPage: "Supervisors" } })

// Filters
const tour = ref<TourType | undefined>()
const year = useRouteQuery("year", new Date().getFullYear().toString())
const months = ref<MonthType[] | undefined>()
const surfaces = ref<SurfaceType[] | undefined>()
const environment = ref<EnvironmentType | undefined>()
const categories = ref<CategoryType[] | undefined>()

// API calls
const { data: years } = await useFetch<string[]>("/api/supervisors/years", {
  query: { id: name },
  onResponse: ({ response }) => (year.value = response._data[response._data.length - 1]),
  default: () => []
})

const { data, status } = await useFetch<APISupervisorResponseType>("/api/supervisors/details", {
  query: { id: name, year, surfaces, months, categories, environment, tour },
  default: () => ({ labels: [], events: [] })
})
</script>

<template>
  <page-wrapper>
    <template #nav-right>
      <u-button
        v-if="data.labels.includes('Umpire')"
        :to="{ name: 'umpire', params: { id: params.id } }"
        :icon="icons.umpire"
        :label="mdAndDown ? undefined : 'Umpire Profile'"
        :size="mdAndDown ? 'xs' : 'sm'"
      />
      <u-slideover
        v-if="mdAndDown"
        :title="name"
        class="ml-auto"
      >
        <u-button
          :icon="icons.filter"
          size="xs"
        />
        <template #body>
          <select-year
            v-model="year"
            :items="years"
          />
          <select-month v-model="months" />
          <select-tour v-model="tour" />
          <select-category
            v-model="categories"
            v-model:tour="tour"
          />
          <select-surface
            v-model="surfaces"
            v-model:environment="environment"
          />
        </template>
      </u-slideover>
    </template>

    <template
      #toolbar
      v-if="!mdAndDown"
    >
      <select-year
        v-model="year"
        :items="years"
      />
      <select-month v-model="months" />
      <select-tour v-model="tour" />
      <select-category
        v-model="categories"
        v-model:tour="tour"
      />
      <select-surface
        v-model="surfaces"
        v-model:environment="environment"
      />
    </template>

    <component
      :is="viewMode === 'list' ? TournamentCalendarTable : TournamentCalendarGrid"
      :key="viewMode"
      :events="data.events"
      :status
      :value="name"
    />
  </page-wrapper>
</template>
