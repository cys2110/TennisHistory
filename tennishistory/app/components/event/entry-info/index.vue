<script setup lang="ts">
import { EventEntryInfoGrid, EventEntryInfoTable } from "#components"

const {
  params: { eid }
} = useRoute()
const {
  ui: { icons }
} = useAppConfig()
const { viewMode } = useDefaults()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1024 })
const mdAndUp = breakpoints.greaterOrEqual("md")

// API call
const { data: teams, status } = await useFetch<EntryInfoInterface[]>("/api/events/entry-info", {
  key: `event-entry-info-${eid}`,
  query: { id: eid },
  default: () => []
})
</script>

<template>
  <dashboard-subpanel
    title="Entry Information"
    :icon="icons.info"
  >
    <template #right>
      <event-entry-info-chart
        v-if="teams.length && mdAndUp"
        :teams
      />
    </template>

    <component
      :is="viewMode === 'cards' ? EventEntryInfoGrid : EventEntryInfoTable"
      :teams
      :status
    />
  </dashboard-subpanel>
</template>
