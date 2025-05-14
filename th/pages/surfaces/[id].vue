<script setup lang="ts">
import { EventsGrid, EventsTable } from "#components"

definePageMeta({ name: "surface" })
const appConfig = useAppConfig()
const route = useRoute()
const toast = useToast()
const { viewMode } = useViewMode()

const name = computed(() => decodeName(route.params.id as string))
useHead({ title: () => name.value, templateParams: { subPage: "Surfaces" } })

const skip = ref(0)
const events = ref<EventCardType[]>([])
const tournamentSort = ref<"ASC" | "DESC" | undefined>(undefined)
const categorySort = ref<"ASC" | "DESC" | undefined>(undefined)
const dateSort = ref<"ASC" | "DESC" | undefined>(undefined)

// Set select values
const year = ref<string>(new Date().getFullYear().toString())
const months = ref<(keyof typeof MonthEnum)[] | undefined>()
const categories = ref<CategoryEnum[] | undefined>()
const environment = ref<("Indoor" | "Outdoor")[] | undefined>()

// Breadcrumbs
const breadcrumbs = computed(() => [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Surfaces", to: { name: "surfaces" }, icon: ICONS.court },
  { label: name.value }
])

interface APIResponseType {
  count: number
  events: EventCardType[]
}

// API calls
const { data, status, execute } = await useFetch<APIResponseType>("/api/surfaces/details", {
  query: { id: name, year, months, categories, environment, skip, tournamentSort, categorySort, dateSort },
  default: () => ({ count: 0, events: [] }),
  lazy: true,
  immediate: false,
  onResponse: ({ response }) => (events.value = [...events.value, ...(response._data.events || [])]),
  onResponseError: ({ error }) => {
    toast.add({
      title: `Error fetching events which took place on ${name.value}`,
      description: error?.message,
      icon: appConfig.ui.icons.error,
      color: "error"
    })
    showError(error!)
  }
})

execute()

watch([months, categories, environment, year, tournamentSort, categorySort, dateSort], () => {
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
          <category-select v-model="categories" />
        </u-dashboard-toolbar>
      </template>

      <template #body>
        <component
          :is="viewMode === 'cards' ? EventsGrid : EventsTable"
          :key="viewMode"
          v-model="skip"
          v-model:tournament-sort="tournamentSort"
          v-model:date-sort="dateSort"
          v-model:category-sort="categorySort"
          :events
          :status
          :count="data?.count ?? 0"
          :value="`${name} in ${year}`"
        />
      </template>
    </u-dashboard-panel>
  </div>
</template>
