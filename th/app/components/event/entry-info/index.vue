<script setup lang="ts">
import { EventEntryInfoGrid, EventEntryInfoTable } from "#components"

const {
  ui: { icons }
} = useAppConfig()
const { viewMode } = useViewMode()
const { params } = useRoute()
const { eid } = params as { eid: string }

// API call
const { data: entryInfo, status } = await useFetch<EntryInfoType[]>("/api/events/entry-info", {
  key: `entry-info-${eid}`,
  query: { id: eid },
  default: () => []
})
</script>

<template>
  <dashboard-subpanel
    id="entry-info"
    title="Entry Information"
    :icon="icons.info"
  >
    <template #right>
      <event-entry-info-tree
        v-if="entryInfo.length"
        :data="entryInfo"
      />
    </template>

    <component
      :is="viewMode === 'list' ? EventEntryInfoTable : EventEntryInfoGrid"
      :key="viewMode"
      :data="entryInfo"
      :status
    />
  </dashboard-subpanel>
</template>
