<script setup lang="ts">
defineProps<{ tours?: TourType[] }>()
const modelValue = defineModel<TourType[]>()
</script>

<template>
  <u-checkbox-group
    legend="Tour"
    v-model="modelValue"
    :items="tours ?? ['ATP', 'WTA', 'ITF (M)', 'ITF (W)']"
    :ui="{
      root: 'my-2',
      item: 'ml-3'
    }"
  />
</template>
