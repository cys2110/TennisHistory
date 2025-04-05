<script setup lang="ts">
defineProps<{ checked: boolean }>()
const eid = useRouteParams<string>("eid")
const year = useRouteParams<string>("year")
const paramName = useRouteParams<string>("name")
const name = computed(() => decodeName(paramName.value))
const toast = useToast()

// API call
const { data: awards, status } = await useFetch<RoundInterface[]>("/api/event-awards", {
  query: { eid },
  onResponseError: () => {
    toast.add({
      title: `Error fetching awards for ${name.value} ${year.value}`,
      icon: ICONS.error,
      color: "error"
    })
  }
})
</script>

<template>
  <dashboard-subpanel
    title="Awards"
    :icon="ICONS.awards"
  >
    <awards-table
      v-if="awards && checked"
      :awards
    />

    <awards-chart
      v-else-if="awards"
      :awards
    />

    <error-message
      v-else
      :icon="ICONS.noAwards"
      :title="`No awards found for ${name} ${year}`"
      :status
    />
  </dashboard-subpanel>
</template>
