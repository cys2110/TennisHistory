<script setup lang="ts">
defineProps<{
  eventDetails: {
    id: string
    title: string
    value: any
  }[]
  status: APIStatusType
}>()

const route = useRoute()
const name = computed(() => decodeName(route.params.name as string))
</script>

<template>
  <u-page-columns v-if="eventDetails.length || ['pending', 'idle'].includes(status)">
    <details-card
      v-if="eventDetails.length"
      v-for="detail in eventDetails"
      :key="detail.id"
      :detail
    />

    <base-loading-card
      v-else
      v-for="_ in 10"
      :key="_"
    />
  </u-page-columns>
  <error-message
    v-else
    :message="`No details found for ${name} ${route.params.year}`"
  />
</template>
