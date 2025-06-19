<script setup lang="ts">
defineProps<{ tours: TourType[] }>()
</script>

<template>
  <div class="flex gap-5 flex-col">
    <event-details :tours />
    <event-awards :tours />
    <event-seeds :tours />
    <event-entry-info :tours />
    <event-entries :tours />
  </div>
</template>
