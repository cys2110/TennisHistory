<script setup lang="ts">
import { EventSeedsGrid, EventSeedsTable } from "#components"

const {
  params: { eid }
} = useRoute()
const { icons } = useAppConfig()
const { viewMode } = useDefaults()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1024 })
const mdAndUp = breakpoints.greaterOrEqual("md")

// API call
const { data: seeds, status } = await useFetch<SeedInterface[]>("/api/events/seeds", {
  key: `event-seeds-${eid}`,
  query: { id: eid },
  default: () => []
})
</script>

<template>
  <dashboard-subpanel
    title="Seeds"
    :icon="icons.seeds"
  >
    <template #right>
      <event-seeds-chart
        v-if="seeds.length && mdAndUp"
        :seeds
      />
    </template>

    <component
      :is="viewMode === 'cards' ? EventSeedsGrid : EventSeedsTable"
      :seeds
      :status
    />
  </dashboard-subpanel>
</template>
