<script setup lang="ts">
import { PlayerRecordGrid, PlayerRecordTable } from "#components"

definePageMeta({ name: "record" })
const { viewMode } = useViewMode()
const { params } = useRoute()
const { id } = params as { id: string }

// API call
const { data: results, status } = await useFetch<RecordAPIType>("/api/players/record", {
  key: `record-${id}`,
  query: { id },
  default: () => ({ singles: [], doubles: [] })
})
</script>

<template>
  <player-wrapper v-slot="{ tour, first_name, last_name }">
    <component
      :is="viewMode === 'list' ? PlayerRecordTable : PlayerRecordGrid"
      :key="viewMode"
      :results
      :status
      :tour
      :first-name="first_name"
      :last-name="last_name"
    />
  </player-wrapper>
</template>
