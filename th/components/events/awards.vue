<script setup lang="ts">
import { AwardsGrid, AwardsTable } from "#components"

const appConfig = useAppConfig()
const route = useRoute()
const toast = useToast()
const { viewMode } = useViewMode()
const name = computed(() => decodeName(route.params.name as string))

// API call
const { data: awards, status } = await useFetch<RoundInterface[]>("/api/events/awards", {
  query: { id: route.params.eid },
  default: () => [],
  onResponseError: ({ error }) => {
    toast.add({
      title: `Error fetching awards for ${name.value} ${route.params.year}`,
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
    title="Awards"
    :icon="ICONS.awards"
  >
    <template #right>
      <awards-chart
        v-if="awards.length"
        :awards
      />
    </template>
    <component
      :is="viewMode === 'cards' ? AwardsGrid : AwardsTable"
      :key="viewMode"
      :awards
      :status
    />
  </dashboard-subpanel>
</template>
