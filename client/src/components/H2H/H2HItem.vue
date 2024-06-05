<script setup lang="ts">
const props = defineProps<{
    meter?: number
}>()
</script>

<template>
    <div class="my-3 text-zinc-300">
        <div class="flex justify-between">
            <div class="text-sm font-bold">
                <slot name="p1"></slot>
            </div>
            <div class="text-sm">
                <slot name="metric"></slot>
            </div>
            <div class="text-sm font-bold">
                <slot name="p2"></slot>
            </div>
        </div>
        <div v-if="meter">
            <v-progress-linear
                height="10"
                rounded
                max="100"
                color="#3730a3"
                class="!bg-green-800"
                :model-value="meter"
            />
        </div>
    </div>
</template>