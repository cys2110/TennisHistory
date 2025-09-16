<script setup lang="ts">
defineProps<{ levels?: LevelType[] }>()
const modelValue = defineModel<LevelType[]>()
</script>

<template>
  <u-checkbox-group
    legend="Level"
    v-model="modelValue"
    :items="levels ?? LEVEL_OPTIONS"
    :ui="{
      item: 'ml-3'
    }"
  />
</template>
