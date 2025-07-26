<script setup lang="ts">
const modelValue = defineModel<MatchType[]>()
</script>

<template>
  <u-checkbox-group
    legend="Match Type"
    v-model="modelValue"
    :items="['Singles', 'Doubles']"
    orientation="horizontal"
  />
</template>
