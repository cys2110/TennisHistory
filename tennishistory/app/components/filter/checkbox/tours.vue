<script setup lang="ts">
const modelValue = defineModel<TourType[]>()
</script>

<template>
  <u-checkbox-group
    legend="Tour"
    v-model="modelValue"
    :items="TOUR_OPTIONS"
    orientation="horizontal"
  />
</template>
