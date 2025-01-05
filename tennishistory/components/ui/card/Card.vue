<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = defineProps<{
    class?: HTMLAttributes["class"];
}>();
</script>

<template>
    <div :class="cn('rounded-xl border border-primary-600 bg-white text-zinc-950 shadow shadow-primary-800 hover:shadow-md hover:shadow-primary-800 dark:border-primary-600 dark:shadow-primary-400 dark:hover:shadow-primary-400 dark:bg-zinc-950 dark:text-zinc-50 pb-5', props.class)">
        <slot />
    </div>
</template>
