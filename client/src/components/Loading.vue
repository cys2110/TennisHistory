<script setup lang="ts">
const props = defineProps<{
    loading: boolean
}>()
</script>

<template>
    <div v-if="loading" class="!text-zinc-400 my-5 text-2xl">
        Loading...
    </div>
    <div v-else class="!text-zinc-400 my-5 text-2xl">
        <slot name="None" />
    </div>
</template>