<script setup lang="ts">
const modelValue = defineModel<string>()
</script>

<template>
  <u-radio-group
    v-model="modelValue"
    :items="LETTERS"
    orientation="horizontal"
    @update:model-value="emits('update:modelValue', $event)"
  >
    <template #legend> Use <u-kbd value="meta" /> <u-kbd value="shift" /> <u-kbd value="letter" /> to select a letter </template>
  </u-radio-group>
</template>
