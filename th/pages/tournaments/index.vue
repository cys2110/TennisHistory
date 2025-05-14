<script setup lang="ts">
import { TournamentsGrid, TournamentsTable } from "#components"

useHead({ title: "Tournaments", templateParams: { subPage: null } })
const { viewMode } = useViewMode()
const appConfig = useAppConfig()
const toast = useToast()

const selectedLetter = ref<string>("All")
const skip = ref(0)
const sort = ref<"ASC" | "DESC">("ASC")
const tournaments = ref<Pick<TournamentInterface, "id" | "name" | "years">[]>([])

// Breadcrumbs
const breadcrumbs = computed(() => [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Tournaments", icon: ICONS.tournament }
])

interface APIResponseType {
  count: number
  tournaments: Pick<TournamentInterface, "id" | "name" | "years">[]
}

// API call
const { data, status, execute } = await useFetch<APIResponseType>("/api/tournaments", {
  query: { skip, sort, letter: selectedLetter },
  default: () => ({ count: 0, tournaments: [] }),
  lazy: true,
  immediate: false,
  onResponse: ({ response }) => (tournaments.value = [...tournaments.value, ...(response._data.tournaments || [])]),
  onResponseError: ({ error }) => {
    toast.add({
      title: "Error fetching tournaments",
      description: error?.message,
      icon: appConfig.ui.icons.error,
      color: "error"
    })
    showError(error!)
  }
})

execute()

watch([sort, selectedLetter], () => {
  skip.value = 0
  tournaments.value = []
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
          <letters-select v-model="selectedLetter" />
        </u-dashboard-toolbar>
      </template>

      <template #body>
        <component
          :is="viewMode === 'cards' ? TournamentsGrid : TournamentsTable"
          :key="viewMode"
          v-model="skip"
          v-model:sort="sort"
          :tournaments
          :status
          :count="data?.count ?? 0"
        />
      </template>
    </u-dashboard-panel>
  </div>
</template>
