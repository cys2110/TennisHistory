<script setup lang="ts">
defineProps<{ tours?: TourType[] }>()
const modelValue = defineModel<TourType[]>()
</script>

<template>
  <u-checkbox-group
    legend="Tour"
    v-model="modelValue"
    :items="tours ?? TOUR_OPTIONS"
    :ui="{
      item: 'ml-3'
    }"
  />
</template>
