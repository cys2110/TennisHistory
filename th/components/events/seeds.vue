<script setup lang="ts">
defineProps<{ checked: boolean }>()
const eid = useRouteParams<string>("eid")
const year = useRouteParams<string>("year")
const paramName = useRouteParams<string>("name")
const name = computed(() => decodeName(paramName.value))
const toast = useToast()

// API call
const { data: seeds, status } = await useFetch<SeedType[]>("/api/event-seeds", {
  query: { eid },
  onResponseError: () => {
    toast.add({
      title: `Error fetching seeds for ${name.value} ${year.value}`,
      icon: ICONS.error,
      color: "error"
    })
  }
})
</script>

<template>
  <dashboard-subpanel
    title="Seeds"
    :icon="ICONS.seeds"
  >
    <seeds-table
      v-if="seeds && checked"
      :seeds
    />

    <seeds-chart
      v-else-if="seeds"
      :seeds
    />

    <error-message
      v-else
      :icon="ICONS.noInfo"
      :title="`No seeds found for ${name} ${year}`"
      :status
    />
  </dashboard-subpanel>
</template>
