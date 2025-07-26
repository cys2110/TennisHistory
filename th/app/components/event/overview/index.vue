<script setup lang="ts">
const { tours } = defineProps<{ tours: TourType[] }>()
provide<TourType[]>("tours", tours)
</script>

<template>
  <div class="flex gap-5 flex-col">
    <event-details />
    <event-awards />
    <event-seeds />
    <event-entry-info />
    <!-- <event-entries /> -->
  </div>
</template>
