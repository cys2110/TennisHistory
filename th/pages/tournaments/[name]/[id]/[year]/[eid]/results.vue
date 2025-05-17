<script setup lang="ts">
import { ResultsGrid, ResultsTable } from "#components"

definePageMeta({ name: "results" })
const appConfig = useAppConfig()
const route = useRoute()
const toast = useToast()
const { viewMode } = useViewMode()

const name = computed(() => decodeName(route.params.name as string))

type ResultsType = {
  title: RoundType
  matches: Pick<MatchInterface, "match_no" | "date" | "court" | "duration" | "incomplete" | "umpire" | "winner" | "loser">[]
}

// API call
const { data: results, status } = await useFetch<ResultsType[]>("/api/events/results", {
  query: { id: route.params.eid },
  default: () => [],
  onResponseError: ({ error }) => {
    toast.add({
      title: `Error fetching results for ${name.value} ${route.params.year}`,
      description: error?.message,
      icon: appConfig.ui.icons.error,
      color: "error"
    })
    showError(error!)
  }
})
</script>

<template>
  <event-wrapper>
    <component
      :is="viewMode === 'cards' ? ResultsGrid : ResultsTable"
      :key="viewMode"
      :rounds="results"
      :status
    />
  </event-wrapper>
</template>
