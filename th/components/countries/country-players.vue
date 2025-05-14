<script setup lang="ts">
import { CountryPlayersGrid, CountryPlayersTable } from "#components"

defineProps<{ name?: string }>()
const appConfig = useAppConfig()
const route = useRoute()
const toast = useToast()
const { viewMode } = useViewMode()

const skip = ref(0)
const selectedLetter = ref<string>("All")
const sort = ref<"ASC" | "DESC">("ASC")
const players = ref<(Pick<PlayerInterface, "id" | "name" | "country" | "min_year" | "max_year"> & { current?: boolean })[]>([])

interface APIResponseType {
  count: number
  players: Pick<PlayerInterface, "id" | "name" | "country" | "min_year" | "max_year">[]
}

// API call
const { data, status, execute } = await useFetch<APIResponseType>("/api/countries/players", {
  query: { id: route.params.id, skip, sort, letter: selectedLetter },
  default: () => ({ count: 0, players: [] }),
  lazy: true,
  immediate: false,
  onResponse: ({ response }) => (players.value = [...players.value, ...(response._data.players || [])]),
  onResponseError: ({ error }) => {
    toast.add({
      title: `Error fetching venues located in ${name ?? route.params.id}`,
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
  <dashboard-subpanel
    title="Curent/Former Players"
    :icon="ICONS.player"
  >
    <div>
      <letters-select
        v-model="selectedLetter"
        :ui="{
          fieldset: 'grid grid-cols-6 sm:grid-cols-8 md:grid-cols-8 lg:grid-cols-10 xl:!grid-cols-16 xl:grid',
          base: 'cursor-pointer'
        }"
      />
    </div>
    <component
      :is="viewMode === 'cards' ? CountryPlayersGrid : CountryPlayersTable"
      :key="viewMode"
      v-model="skip"
      v-model:sort="sort"
      :players
      :status
      :count="data?.count ?? 0"
      :name
    />
  </dashboard-subpanel>
</template>
