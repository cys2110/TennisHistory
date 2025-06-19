<script setup lang="ts">
import { EventSeedsGrid, EventSeedsTable } from "#components"
defineProps<{ tours: TourType[] }>()
const { viewMode } = useViewMode()
const { icons } = useAppConfig()
const { params } = useRoute()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1280 })
const mdAndUp = breakpoints.greaterOrEqual("md")

// API call
const { data: seeds, status } = await useFetch<APISeedsResponseType>("/api/events/seeds", {
  query: { id: params.eid },
  default: () => ({ mainSeeds: [], qualSeeds: [] })
})
</script>

<template>
  <dashboard-subpanel
    title="Seeds"
    :icon="icons.seeds"
  >
    <template #right>
      <event-seeds-chart
        v-if="seeds.mainSeeds.length && mdAndUp"
        :seeds
        :tours
      />
    </template>

    <component
      :is="viewMode === 'list' ? EventSeedsTable : EventSeedsGrid"
      :seeds
      :status
      :tours
    />
  </dashboard-subpanel>
</template>
