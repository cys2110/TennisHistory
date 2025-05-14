<script setup lang="ts">
import { EntryInfoGrid, EntryInfoTable } from "#components"

const appConfig = useAppConfig()
const route = useRoute()
const toast = useToast()
const { viewMode } = useViewMode()
const name = computed(() => decodeName(route.params.name as string))

// API call
const { data, status } = await useFetch<EntryInfoType[]>("/api/events/entry-info", {
  query: { id: route.params.eid },
  default: () => [],
  onResponseError: ({ error }) => {
    toast.add({
      title: `Error fetching entry information for ${name.value} ${route.params.year}`,
      description: error?.message,
      icon: appConfig.ui.icons.error,
      color: "error"
    })
    showError(error!)
  }
})
</script>

<template>
  <dashboard-subpanel
    title="Entry Information"
    :icon="appConfig.ui.icons.info"
  >
    <template #right>
      <entry-info-tree
        v-if="data.length"
        :data
      />
    </template>
    <component
      :is="viewMode === 'cards' ? EntryInfoGrid : EntryInfoTable"
      :key="viewMode"
      :data
      :status
    />
  </dashboard-subpanel>
</template>
