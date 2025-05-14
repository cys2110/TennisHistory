<script setup lang="ts">
import { EventsGrid, EventsTable } from "#components"

defineProps<{ breadcrumbs: BreadcrumbType[] }>()
const route = useRoute()
const toast = useToast()
const appConfig = useAppConfig()
const { viewMode } = useViewMode()

const skip = ref(0)
const events = ref<EventCardType[]>([])
const tournamentSort = ref<"ASC" | "DESC" | undefined>(undefined)
const categorySort = ref<"ASC" | "DESC" | undefined>(undefined)
const dateSort = ref<"ASC" | "DESC" | undefined>(undefined)
const surfaceSort = ref<"ASC" | "DESC" | undefined>(undefined)

// Set select values
const year = useRouteQuery("year", new Date().getFullYear().toString())
const months = ref<(keyof typeof MonthEnum)[] | undefined>()
const categories = ref<CategoryEnum[] | undefined>()
const surfaces = ref<SurfaceEnum[] | undefined>()
const environment = ref<("Indoor" | "Outdoor")[] | undefined>()

interface APIResponseType {
  count: number
  events: EventCardType[]
}

// API call
const { data, status, execute } = await useFetch<APIResponseType>("/api/results-archive", {
  query: {
    surfaces,
    months,
    categories,
    year,
    environment,
    upcoming: route.name === "upcoming-tournaments",
    skip,
    tournamentSort,
    categorySort,
    dateSort,
    surfaceSort
  },
  default: () => ({ count: 0, events: [] }),
  lazy: true,
  immediate: false,
  onResponse: ({ response }) => (events.value = [...events.value, ...(response._data.events || [])]),
  onResponseError: ({ error }) => {
    toast.add({
      title: route.name === "upcoming-tournaments" ? "Error fetching upcoming tournaments" : `Error fetching tournaments for ${year}`,
      icon: appConfig.ui.icons.error,
      color: "error"
    })
    showError(error!)
  }
})

execute()

watch([surfaces, months, categories, environment, year, tournamentSort, categorySort, dateSort, surfaceSort], () => {
  skip.value = 0
  events.value = []
})
</script>

<template>
  <div class="w-full">
    <u-dashboard-panel>
      <template #header>
        <u-dashboard-navbar>
          <template #leading>
            <u-dashboard-sidebar-collapse />
          </template>

          <template #title>
            <u-breadcrumb :items="breadcrumbs" />
          </template>
        </u-dashboard-navbar>

        <u-dashboard-toolbar>
          <all-years-select
            v-if="route.name === 'results-archive'"
            v-model="year"
          />
          <month-select v-model="months" />
          <category-select v-model="categories" />
          <surface-select
            v-model="surfaces"
            v-model:env="environment"
          />
        </u-dashboard-toolbar>
      </template>

      <template #body>
        <component
          :is="viewMode === 'cards' ? EventsGrid : EventsTable"
          :key="viewMode"
          v-model="skip"
          v-model:tournament-sort="tournamentSort"
          v-model:category-sort="categorySort"
          v-model:date-sort="dateSort"
          v-model:surface-sort="surfaceSort"
          :events
          :status
          :count="data?.count ?? 0"
          :value="year"
        />
      </template>
    </u-dashboard-panel>
  </div>
</template>
