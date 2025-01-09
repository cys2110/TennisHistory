<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div :class="cn('rounded-xl flex flex-col border border-slate-200 bg-white text-slate-950 shadow dark:border-violet-700 dark:bg-transparent dark:shadow-sm dark:shadow-violet-600 dark:hover:shadow-md dark:hover:shadow-violet-600 dark:text-slate-300', props.class)">
    <slot />
  </div>
</template>
