<script setup lang="ts">
import { UmpireMatchGrid, UmpireMatchTable } from "#components"
// TODO: Add player search
definePageMeta({ name: "umpire" })
const { viewMode } = useViewMode()
const { icons } = useAppConfig()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1280 })
const mdAndDown = breakpoints.smallerOrEqual("md")

const { params } = useRoute()
const name = computed(() => decodeName(params.id as string))
useHead({ title: () => name.value, templateParams: { subPage: "Umpires" } })

// Filters
const tour = ref<TourType | undefined>()
const year = useRouteQuery<string | undefined>("year", undefined)
const months = ref<MonthType[] | undefined>()
const categories = ref<CategoryType[] | undefined>()
const surfaces = ref<SurfaceType[] | undefined>()
const environment = ref<EnvironmentType | undefined>()
const player = ref<string | undefined>()

// API calls
const { data: years } = await useFetch<string[]>("/api/umpires/years", {
  query: { id: name }
})

const { data, status, refresh } = await useFetch<APIUmpireResponseType>("/api/umpires/details", {
  query: { id: name, year, surfaces, months, categories, environment, tour, player },
  default: () => ({ labels: [], events: [] }),
  watch: false
})

watch(player, newValue => {
  if (newValue) {
    year.value = undefined
    months.value = undefined
    categories.value = undefined
    surfaces.value = undefined
    environment.value = undefined
    tour.value = undefined
    refresh()
  }
})

watch([year, months, categories, surfaces, environment, tour], () => {
  player.value = undefined
  refresh()
})
</script>

<template>
  <page-wrapper>
    <template #nav-right>
      <u-button
        v-if="data.labels.includes('Supervisor')"
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
          <player-search v-model="player" />
          <select-year
            v-if="years"
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
        v-if="years"
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
      :is="viewMode === 'list' ? UmpireMatchTable : UmpireMatchGrid"
      :key="viewMode"
      :events="data.events"
      :status
    />
  </page-wrapper>
</template>
