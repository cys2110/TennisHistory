<script setup lang="ts">
import { PlayersGrid, PlayersTable } from "#components"

useHead({ title: "Players", templateParams: { subPage: null } })
const { viewMode } = useViewMode()
const appConfig = useAppConfig()
const toast = useToast()

const selectedLetter = ref<string>("All")
const skip = ref(0)
const sort = ref<"ASC" | "DESC">("ASC")
const players = ref<Pick<PlayerInterface, "id" | "name" | "country" | "min_year" | "max_year">[]>([])

// Breadcrumbs
const breadcrumbs = computed(() => [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Players", icon: ICONS.people }
])

interface APIResponseType {
  count: number
  players: Pick<PlayerInterface, "id" | "name" | "country" | "min_year" | "max_year">[]
}

// API call
const { data, status, execute } = await useFetch<APIResponseType>("/api/players", {
  query: { skip, sort, letter: selectedLetter },
  default: () => ({ count: 0, players: [] }),
  lazy: true,
  immediate: false,
  onResponse: ({ response }) => (players.value = [...players.value, ...(response._data.players || [])]),
  onResponseError: ({ error }) => {
    toast.add({
      title: "Error fetching players",
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
  players.value = []
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
          :is="viewMode === 'cards' ? PlayersGrid : PlayersTable"
          :key="viewMode"
          v-model="skip"
          v-model:sort="sort"
          :players
          :status
          :count="data?.count ?? 0"
        />
      </template>
    </u-dashboard-panel>
  </div>
</template>
