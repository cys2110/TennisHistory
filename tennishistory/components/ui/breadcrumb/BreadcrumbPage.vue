<script lang="ts" setup>
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = defineProps<{
    class?: HTMLAttributes["class"];
}>();
</script>

<template>
    <span
        role="link"
        aria-disabled="true"
        aria-current="page"
        :class="cn('font-normal text-emerald-700 dark:text-emerald-400/90', props.class)"
    >
        <slot />
    </span>
</template>
