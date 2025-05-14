<script setup lang="ts">
import { WinnersByAgeGrid, WinnersByAgeTable } from "#components"

const appConfig = useAppConfig()
const route = useRoute()
const toast = useToast()
const { viewMode } = useViewMode()
const name = computed(() => decodeName(route.params.name as string))

// API call
const { data: ages, status } = await useFetch<WinnersByAgeInterface[]>("/api/tournaments/winner-ages", {
  query: { id: route.params.id },
  default: () => [],
  onResponseError: ({ error }) => {
    toast.add({
      title: `Error fetching winners by age for ${name.value}`,
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
    title="Winners by Age"
    :icon="ICONS.calendar"
  >
    <template #right>
      <winners-by-age-chart :ages />
    </template>

    <component
      :is="viewMode === 'cards' ? WinnersByAgeGrid : WinnersByAgeTable"
      :key="viewMode"
      :ages
      :status
    />
  </dashboard-subpanel>
</template>
