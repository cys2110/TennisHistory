<script setup>
const props = defineProps(['placeholder', 'modelValue'])
</script>

<template>
    <input v-bind="$attrs" :placeholder="placeholder" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" />
</template>

<style scoped>
input {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    background-color: transparent;
    outline: transparent;
    border: none;
    border-bottom: 1px solid var(--color-border-hover);
    padding: 0.2rem;
    color: var(--color-text);
    font-size: 17px;
}
</style>