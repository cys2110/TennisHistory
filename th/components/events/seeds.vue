<script setup lang="ts">
import { SeedsGrid, SeedsTable } from "#components"

const appConfig = useAppConfig()
const route = useRoute()
const toast = useToast()
const { viewMode } = useViewMode()
const name = computed(() => decodeName(route.params.name as string))

// API call
const { data: seeds, status } = await useFetch<SeedType[]>("/api/events/seeds", {
  query: { id: route.params.eid },
  default: () => [],
  onResponseError: ({ error }) => {
    toast.add({
      title: `Error fetching seeds for ${name.value} ${route.params.year}`,
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
    title="Seeds"
    :icon="ICONS.seeds"
  >
    <template #right>
      <seeds-chart
        v-if="seeds.length"
        :seeds
      />
    </template>
    <component
      :is="viewMode === 'cards' ? SeedsGrid : SeedsTable"
      :key="viewMode"
      :seeds
      :status
    />
  </dashboard-subpanel>
</template>
