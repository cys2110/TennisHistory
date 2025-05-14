<script setup lang="ts">
defineProps<{
  entries: Omit<EntryInterface, "incomplete" | "rank2" | "reason">[]
  status: APIStatusType
}>()
const appConfig = useAppConfig()
const route = useRoute()
const name = computed(() => decodeName(route.params.name as string))
</script>

<template>
  <u-page-grid
    v-if="entries.length || ['pending', 'idle'].includes(status)"
    class="my-5 xl:grid-cols-3 2xl:grid-cols-4"
  >
    <entry-card
      v-if="entries.length"
      v-for="entry in entries"
      :key="entry.id"
      :entry
    />
    <base-loading-card
      v-else
      v-for="_ in 10"
      :key="_"
    />
  </u-page-grid>
  <error-message
    v-else
    :icon="ICONS.noPeople"
    :message="`No entries found for ${name} ${route.params.year}`"
  />
</template>
