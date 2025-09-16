<script setup lang="ts">
const modelValue = defineModel<MatchType[]>()
</script>

<template>
  <u-checkbox-group
    legend="Match Type"
    v-model="modelValue"
    :items="['Singles', 'Doubles']"
    :ui="{
      item: 'ml-3'
    }"
  />
</template>
