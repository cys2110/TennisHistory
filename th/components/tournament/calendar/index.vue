<script setup lang="ts">
import { TournamentCalendarGrid, TournamentCalendarTable } from "#components"

const { name } = useRoute()
const { icons } = useAppConfig()
const { viewMode } = useViewMode()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1280 })
const mdAndDown = breakpoints.smallerOrEqual("md")

// Filters
const tour = ref<TourType | undefined>()
const year = useRouteQuery("year", new Date().getFullYear().toString())
const months = ref<MonthType[] | undefined>()
const categories = ref<CategoryType[] | undefined>()
const environment = ref<EnvironmentType | undefined>()
const surfaces = ref<SurfaceType[] | undefined>()

// API calls
const { data: counts } = await useFetch<Record<string, number>>("/api/events/counts", { query: { year } })

const { data: events, status } = await useFetch<EventCardType[]>("/api/results-archive", {
  query: { surfaces, months, categories, year, environment, upcoming: name === "upcoming-tournaments", tour },
  default: () => []
})

const getEventType = (type: string) => {
  switch (type) {
    case "atp":
      return {
        label: "ATP EVENTS",
        class: "ring-atp dark:ring-atp"
      }
    case "wta":
      return {
        label: "WTA EVENTS",
        class: "ring-wta dark:ring-wta"
      }
    case "itf_men":
      return {
        label: "ITF MEN'S EVENTS",
        class: "ring-men dark:ring-men"
      }
    case "itf_women":
      return {
        label: "ITF WOMEN'S EVENTS",
        class: "ring-women dark:ring-women"
      }
    default:
      return {
        label: "TOTAL EVENTS",
        class: "ring-joint dark:ring-joint"
      }
  }
}
</script>

<template>
  <page-wrapper>
    <template
      #nav-right
      v-if="mdAndDown"
    >
      <u-slideover
        title="Filters"
        class="ml-auto"
      >
        <u-button
          :icon="icons.filter"
          size="xs"
        />
        <template #body>
          <select-all-years
            v-if="name === 'results-archive'"
            v-model="year"
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
      v-else
    >
      <select-all-years
        v-if="name === 'results-archive'"
        v-model="year"
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
    <div
      v-if="name === 'results-archive' && counts"
      class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-8"
    >
      <u-card
        v-for="(count, type) in counts"
        :key="type"
        :class="getEventType(type).class"
        :ui="{
          root: 'w-full',
          header: 'text-lg font-semibold text-(--ui-text-muted)',
          body: 'text-center font-extrabold text-2xl'
        }"
      >
        <template #header>{{ getEventType(type).label }}</template>
        {{ count }}
      </u-card>
    </div>

    <component
      :is="viewMode === 'list' ? TournamentCalendarTable : TournamentCalendarGrid"
      :key="viewMode"
      :events
      :status
    />
  </page-wrapper>
</template>
