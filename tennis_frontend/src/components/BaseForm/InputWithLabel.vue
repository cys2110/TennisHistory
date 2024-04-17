<script setup>
const props = defineProps(['label', 'modelValue'])
</script>

<template>
    <label>{{ label }}</label>
    <input v-bind="$attrs" :placeholder="label" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" />
</template>