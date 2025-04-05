<script setup lang="ts">
defineProps<{ checked: boolean }>()
const eid = useRouteParams<string>("eid")
const year = useRouteParams<string>("year")
const paramName = useRouteParams<string>("name")
const name = computed(() => decodeName(paramName.value))
const toast = useToast()

// API call
const { data: entries, status } = await useFetch<EntryTableType[]>("/api/event-entries", {
  query: { eid },
  onResponseError: () => {
    toast.add({
      title: `Error fetching entries for ${name.value} ${year.value}`,
      icon: ICONS.error,
      color: "error"
    })
  }
})
</script>

<template>
  <dashboard-subpanel
    title="Entries"
    :icon="ICONS.player"
  >
    <entries-table
      v-if="checked && entries && entries.length > 0"
      :entries
    />
    <entry-card
      v-else-if="entries && entries.length > 0"
      :entries
    />
    <error-message
      v-else
      :icon="ICONS.noPeople"
      :title="`No entries found for ${name} ${year}`"
      :status
    />
  </dashboard-subpanel>
</template>
