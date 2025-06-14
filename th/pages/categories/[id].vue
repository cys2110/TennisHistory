<script setup lang="ts">
import { TournamentCalendarGrid, TournamentCalendarTable } from "#components"

definePageMeta({ name: "category" })
const { viewMode } = useViewMode()
const { icons } = useAppConfig()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1280 })
const mdAndDown = breakpoints.smallerOrEqual("md")

const { params } = useRoute()
const name = computed(() => decodeName(params.id as string))
useHead({ title: () => name.value, templateParams: { subPage: "Categories" } })

// Filters
const year = useRouteQuery("year", new Date().getFullYear().toString())
const months = ref<MonthType[] | undefined>()
const surfaces = ref<SurfaceType[] | undefined>()
const environment = ref<EnvironmentType | undefined>()

// API call
const { data: events, status } = await useFetch<EventCardType[]>("/api/categories/details", {
  query: { id: name, year, surfaces, months, environment },
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
      <select-all-years v-model="year" />
      <select-month v-model="months" />
      <select-surface
        v-model="surfaces"
        v-model:environment="environment"
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
