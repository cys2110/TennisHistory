<script setup lang="ts">
defineProps<{ levels?: LevelType[] }>()
const modelValue = defineModel<LevelType[]>()
</script>

<template>
  <u-checkbox-group
    legend="Level"
    v-model="modelValue"
    :items="levels ?? ['Tour', 'Challenger', 'ITF']"
    :ui="{
      root: 'my-2',
      item: 'ml-3'
    }"
  />
</template>
