<script setup lang="ts">
import { EventAwardsGrid, EventAwardsTable } from "#components"
const { viewMode } = useViewMode()
const { icons } = useAppConfig()
const { params } = useRoute()
const { eid } = params as { eid: string }
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1280 })
const mdAndUp = breakpoints.greaterOrEqual("md")

// API call
const { data: awards, status } = await useFetch<RoundInterface[]>("/api/events/awards", {
  query: { id: eid },
  default: () => []
})
</script>

<template>
  <dashboard-subpanel
    id="awards"
    title="Awards"
    :icon="icons.awards"
  >
    <template #right>
      <event-awards-chart
        v-if="awards.length && mdAndUp"
        :awards
      />
    </template>

    <component
      :is="viewMode === 'cards' ? EventAwardsGrid : EventAwardsTable"
      :awards
      :status
    />
  </dashboard-subpanel>
</template>
