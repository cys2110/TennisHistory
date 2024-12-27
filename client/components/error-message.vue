<script setup>
const props = defineProps(['status', 'errorIcon'])
</script>

<template>
    <Message size="large" :severity="status === 'pending' ? 'info' : 'warn'" variant="outlined" class="mt-5">
        <template #icon>
            <Icon :name="status === 'pending' ? 'line-md:loading-twotone-loop' : errorIcon" class="text-2xl" />
        </template>
        <span v-if="status === 'pending'" class="ml-2">
            <slot name="loading-message" />
        </span>
        <span v-else class="ml-2">
            <slot name="error-message" />
        </span>
    </Message>
</template>