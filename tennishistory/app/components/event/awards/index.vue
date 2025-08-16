<script setup lang="ts">
import { EventAwardsGrid, EventAwardsTable } from "#components"

const {
  params: { eid }
} = useRoute()
const { icons } = useAppConfig()
const { viewMode } = useDefaults()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1024 })
const mdAndUp = breakpoints.greaterOrEqual("md")

// API call
const { data: awards, status } = await useFetch<RoundInterface[]>("/api/events/awards", {
  key: `event-awards-${eid}`,
  query: { id: eid },
  default: () => []
})
</script>

<template>
  <dashboard-subpanel
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
