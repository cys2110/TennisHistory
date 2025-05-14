<script setup lang="ts">
import { TournamentWinnerGrid, TournamentWinnerTable } from "#components"

const appConfig = useAppConfig()
const route = useRoute()
const toast = useToast()
const name = computed(() => decodeName(route.params.name as string))
const { viewMode } = useViewMode()

type TournamentEventType = Pick<EventInterface, "id" | "year" | "draw_type" | "winner" | "loser"> & {
  match: Pick<MatchInterface, "sets" | "tbs" | "incomplete">
}

// API call
const { data: events, status } = await useFetch<TournamentEventType[]>("/api/tournaments/winners", {
  query: { id: route.params.id },
  default: () => [],
  onResponseError: ({ error }) => {
    toast.add({
      title: `Error fetching events for ${name.value}`,
      description: error?.message,
      icon: appConfig.ui.icons.error,
      color: "error"
    })
    showError(error!)
  }
})
</script>

<template>
  <component
    :is="viewMode === 'cards' ? TournamentWinnerGrid : TournamentWinnerTable"
    :key="viewMode"
    :events
    :status
  />
</template>
