<script setup lang="ts">
import { EventAwardsGrid, EventAwardsTable } from "#components"
defineProps<{ tours: TourType[] }>()
const { viewMode } = useViewMode()
const { icons } = useAppConfig()
const { params } = useRoute()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1280 })
const mdAndUp = breakpoints.greaterOrEqual("md")

// API call
const { data: awards, status } = await useFetch<RoundInterface[]>("/api/events/awards", {
  query: { id: params.eid },
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
      :tours
    />
  </dashboard-subpanel>
</template>
