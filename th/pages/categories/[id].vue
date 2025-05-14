<script setup lang="ts">
import { EventsGrid, EventsTable } from "#components"

definePageMeta({ name: "category" })
const appConfig = useAppConfig()
const route = useRoute()
const toast = useToast()
const { viewMode } = useViewMode()

const name = computed(() => decodeName(route.params.id as string))
useHead({ title: () => name.value, templateParams: { subPage: "Categories" } })

const skip = ref(0)
const events = ref<EventCardType[]>([])
const tournamentSort = ref<"ASC" | "DESC" | undefined>(undefined)
const dateSort = ref<"ASC" | "DESC" | undefined>(undefined)
const surfaceSort = ref<"ASC" | "DESC" | undefined>(undefined)

// Set select values
const year = useRouteQuery("year", new Date().getFullYear().toString())
const months = ref<(keyof typeof MonthEnum)[] | undefined>()
const surfaces = ref<SurfaceEnum[] | undefined>()
const environment = ref<("Indoor" | "Outdoor")[] | undefined>()

// Breadcrumbs
const breadcrumbs = computed(() => [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Categories", to: { name: "categories" }, icon: ICONS.categories },
  { label: name.value }
])

interface APIResponseType {
  count: number
  events: EventCardType[]
}

// API calls
const { data, status, execute } = await useFetch<APIResponseType>("/api/categories/details", {
  query: { id: name, year, surfaces, months, environment, skip, tournamentSort, dateSort, surfaceSort },
  default: () => ({ count: 0, events: [] }),
  lazy: true,
  immediate: false,
  onResponse: ({ response }) => (events.value = [...events.value, ...(response._data.events || [])]),
  onResponseError: ({ error }) => {
    toast.add({
      title: `Error fetching events with category ${name.value}`,
      description: error?.message,
      icon: appConfig.ui.icons.error,
      color: "error"
    })
    showError(error!)
  }
})

execute()

watch([surfaces, months, environment, year, tournamentSort, dateSort, surfaceSort], () => {
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
          <all-years-select v-model="year" />
          <month-select v-model="months" />
          <surface-select v-model="surfaces" />
        </u-dashboard-toolbar>
      </template>

      <template #body>
        <component
          :is="viewMode === 'cards' ? EventsGrid : EventsTable"
          :key="viewMode"
          v-model="skip"
          v-model:tournament-sort="tournamentSort"
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
