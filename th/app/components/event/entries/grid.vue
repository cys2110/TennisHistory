<script setup lang="ts">
defineProps<{
  entries: ConsolidatedEntryType[]
  status: APIStatusType
  tournament: string
  viewType: boolean
}>()
const {
  params: { year }
} = useRoute()
const { icons } = useAppConfig()
</script>

<template>
  <u-page-grid
    v-if="entries.length"
    class="2xl:grid-cols-4"
  >
    <event-entries-card
      v-if="entries.length"
      v-for="(entry, index) in entries"
      :key="`entry-${index}`"
      :entry
      :viewType
    />
  </u-page-grid>
  <error-message
    v-else
    :icon="icons.noPeople"
    :message="`No entries found for ${tournament} ${year}`"
  />
</template>
