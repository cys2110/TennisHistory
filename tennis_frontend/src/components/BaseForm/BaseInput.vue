<script setup>
const props = defineProps(['placeholder', 'modelValue'])
</script>

<template>
    <input v-bind="$attrs" :placeholder="placeholder" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" />
</template>