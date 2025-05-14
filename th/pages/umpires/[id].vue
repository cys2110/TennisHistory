<script setup lang="ts">
import { UmpireGrid, UmpireTable } from "#components"

definePageMeta({ name: "umpire" })
const appConfig = useAppConfig()
const route = useRoute()
const toast = useToast()
const { viewMode } = useViewMode()

const name = computed(() => decodeName(route.params.id as string))
useHead({ title: name.value, templateParams: { subPage: "Umpires" } })

// Breadcrumbs
const breadcrumbs = computed(() => [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Umpires", to: { name: "umpires" }, icon: ICONS.umpire },
  { label: name.value }
])

type EventType = Pick<EventInterface, "id" | "tournament" | "draw_type" | "year" | "surface" | "category" | "venues" | "dates"> & {
  rounds: {
    round: RoundType
    matches: Pick<MatchInterface, "match_no" | "p1" | "p2" | "date">[]
  }[]
}

const skip = ref(0)
const events = ref<EventType[]>([])
const tournamentSort = ref<"ASC" | "DESC" | undefined>(undefined)
const categorySort = ref<"ASC" | "DESC" | undefined>(undefined)
const dateSort = ref<"ASC" | "DESC" | undefined>(undefined)
const surfaceSort = ref<"ASC" | "DESC" | undefined>(undefined)

// Set select values
const year = ref<string>(new Date().getFullYear().toString())
const months = ref<(keyof typeof MonthEnum)[] | undefined>()
const categories = ref<CategoryEnum[] | undefined>()
const surfaces = ref<SurfaceEnum[] | undefined>()
const environment = ref<("Indoor" | "Outdoor")[] | undefined>()

interface APIResponseType {
  labels: string[]
  count: number
  events: EventType[]
}

// API calls
const { data, status, execute } = await useFetch<APIResponseType>("/api/umpires/details", {
  query: { id: name, year, surfaces, months, categories, environment, skip, tournamentSort, categorySort, dateSort, surfaceSort },
  default: () => ({ labels: [], count: 0, events: [] }),
  lazy: true,
  immediate: false,
  onResponse: ({ response }) => (events.value = [...events.value, ...(response._data.events || [])]),
  onResponseError: ({ error }) => {
    toast.add({
      title: `Error fetching matches umpired by ${name.value}`,
      description: error?.message,
      icon: appConfig.ui.icons.error,
      color: "error"
    })
    showError(error!)
  }
})

const { data: years } = await useFetch<string[]>("/api/umpires/years", {
  query: { id: name },
  onResponse: ({ response }) => {
    year.value = response._data[response._data.length - 1]
  },
  onResponseError: ({ error }) => {
    toast.add({
      title: `Error fetching ${name.value}'s active years`,
      description: error?.message,
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

          <template #right>
            <u-button
              v-if="data.labels.includes('Supervisor')"
              :to="{ name: 'supervisor', params: { id: route.params.id } }"
              :icon="ICONS.supervisor"
              label="Supervisor Profile"
              size="sm"
            />
          </template>
        </u-dashboard-navbar>

        <u-dashboard-toolbar>
          <div class="flex flex-col gap-2 w-full">
            <div class="text-(--ui-text-muted) text-sm font-semibold text-center"> Matches umpired by {{ name }} </div>
            <div class="flex justify-between items-center">
              <ClientOnly>
                <year-select
                  v-if="years"
                  v-model="year"
                  :items="years"
                />
              </ClientOnly>
              <month-select v-model="months" />
              <category-select v-model="categories" />
              <surface-select v-model="surfaces" />
            </div>
          </div>
        </u-dashboard-toolbar>
      </template>

      <template #body>
        <component
          :is="viewMode === 'cards' ? UmpireGrid : UmpireTable"
          :key="viewMode"
          v-model="skip"
          v-model:tournament-sort="tournamentSort"
          v-model:date-sort="dateSort"
          v-model:surface-sort="surfaceSort"
          v-model:category-sort="categorySort"
          :events
          :status
          :count="data?.count ?? 0"
        />
      </template>
    </u-dashboard-panel>
  </div>
</template>
