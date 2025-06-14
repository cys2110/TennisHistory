<script setup lang="ts">
import { TournamentCalendarGrid, TournamentCalendarTable } from "#components"

definePageMeta({ name: "surface" })
const { viewMode } = useViewMode()
const { icons } = useAppConfig()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1280 })
const mdAndDown = breakpoints.smallerOrEqual("md")

const { params } = useRoute()
const name = computed(() => decodeName(params.id as string))
useHead({ title: () => name.value, templateParams: { subPage: "Surfaces" } })

// Filters
const tour = ref<TourType | undefined>()
const year = useRouteQuery("year", new Date().getFullYear().toString())
const months = ref<MonthType[] | undefined>()
const environment = ref<EnvironmentType | undefined>()
const categories = ref<CategoryType[] | undefined>()

// API call
const { data: events, status } = await useFetch<EventCardType[]>("/api/surfaces/details", {
  query: { id: name, year, months, categories, tour },
  default: () => []
})
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
          <select-all-years v-model="year" />
          <select-month v-model="months" />
          <select-tour v-model="tour" />
          <select-category
            v-model="categories"
            v-model:tour="tour"
          />
        </template>
      </u-slideover>
    </template>
    <template
      #toolbar
      v-else
    >
      <select-all-years v-model="year" />
      <select-month v-model="months" />
      <select-tour v-model="tour" />
      <select-category
        v-model="categories"
        v-model:tour="tour"
      />
    </template>

    <component
      :is="viewMode === 'list' ? TournamentCalendarTable : TournamentCalendarGrid"
      :key="viewMode"
      :events
      :status
      :value="name"
    />
  </page-wrapper>
</template>
