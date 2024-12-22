<script setup lang="ts">
const props = defineProps<{ message: string }>()
</script>

<template>
    <Message size="large" severity="warn" variant="outlined" class="mt-5">
        <template #icon>
            <div class="text-2xl">
                <slot name="icon" />
            </div>
        </template>
        <span class="ml-2">{{ message }}</span>
    </Message>
</template>