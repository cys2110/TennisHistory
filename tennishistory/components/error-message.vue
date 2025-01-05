<script setup lang="ts">
const props = defineProps<{
    status: string;
    errorIcon: string;
}>();
</script>

<template>
    <shadcn-alert class="border-amber-500 dark:border-amber-600 text-amber-500 dark:text-amber-600 bg-transparent w-3/4 mx-auto font-semibold">
        <shadcn-alert-description>
            <div class="flex justify-center items-center gap-2">
                <Icon
                    :name="status === 'pending' ? 'line-md:loading-twotone-loop' : errorIcon"
                    class="text-2xl"
                />
                <span
                    v-if="status === 'pending'"
                    class="ml-2 text-base"
                >
                    <slot name="loading-message" />
                </span>
                <span
                    v-else
                    class="ml-2 text-base"
                >
                    <slot name="error-message" />
                </span>
            </div>
        </shadcn-alert-description>
    </shadcn-alert>
</template>
