<script lang="ts" setup>
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = defineProps<{
    class?: HTMLAttributes["class"];
}>();
</script>

<template>
    <ol :class="cn('flex flex-wrap items-center gap-1.5 break-words text-base text-emerald-600/75 sm:gap-2.5 dark:text-emerald-600 my-1.5', props.class)">
        <slot />
    </ol>
</template>
