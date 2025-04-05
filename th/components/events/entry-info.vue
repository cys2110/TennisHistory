<script setup lang="ts">
defineProps<{ checked: boolean }>()
const eid = useRouteParams<string>("eid")
const year = useRouteParams<string>("year")
const paramName = useRouteParams<string>("name")
const name = computed(() => decodeName(paramName.value))
const toast = useToast()

// API call
const { data, status } = await useFetch<EntryInfoType[]>("/api/event-entry-info", {
  query: { eid },
  onResponseError: () => {
    toast.add({
      title: `Error fetching entry information for ${name.value} ${year.value}`,
      icon: ICONS.error,
      color: "error"
    })
  }
})
</script>

<template>
  <dashboard-subpanel
    title="Entry Information"
    :icon="ICONS.treeDiagram"
  >
    <entry-info-table
      v-if="data && checked"
      :data
    />

    <entry-info-chart
      v-else-if="data"
      :data
    />

    <error-message
      v-else
      :icon="ICONS.noChart"
      :title="`No entry information found for ${name} ${year}`"
      :status
    />
  </dashboard-subpanel>
</template>
