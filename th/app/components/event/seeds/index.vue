<script setup lang="ts">
import { EventSeedsGrid, EventSeedsTable } from "#components"
const { viewMode } = useViewMode()
const { icons } = useAppConfig()
const { params } = useRoute()
const { eid } = params as { eid: string }
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1280 })
const mdAndUp = breakpoints.greaterOrEqual("md")

interface APIResponseType {
  tournament: string
  seeds: SeedInterface[]
}

// API call
const { data, status } = await useFetch<APIResponseType>("/api/events/seeds", {
  query: { id: eid }
})
</script>

<template>
  <dashboard-subpanel
    id="seeds"
    title="Seeds"
    :icon="icons.seeds"
  >
    <template #right>
      <event-seeds-chart
        v-if="data?.seeds.length && mdAndUp"
        :seeds="data.seeds"
        :tournament="data.tournament"
      />
    </template>

    <component
      :is="viewMode === 'list' ? EventSeedsTable : EventSeedsGrid"
      :seeds="data?.seeds || []"
      :status
      :tournament="data?.tournament || ''"
    />
  </dashboard-subpanel>
</template>
