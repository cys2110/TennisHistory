<script setup lang="ts">
const props = defineProps<{
    checked: boolean
    onIcon: string
    offIcon: string
}>()
const emits = defineEmits<{
    toggle: () => void
}>()
</script>

<template>
    <div v-if="!checked" class="cursor-pointer text-2xl text-violet-400" @click="$emit('toggle')">
        <i :class="offIcon" />
    </div>
    <div v-else class="cursor-pointer text-2xl text-violet-400" @click="$emit('toggle')">
        <i :class="onIcon" />
    </div>
</template>