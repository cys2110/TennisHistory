<script setup lang="ts">
const props = defineProps<{ name: string; tid: string; year: string; eid: string; start?: string }>()
const breakpoints = useBreakpoints(breakpointsTailwind)
const md = breakpoints.md

// Disable buttons if event has not started yet
const startDate = props.start ? new Date(props.start) : new Date()
const currentDate = new Date()
const isDisabled = props.start ? currentDate < startDate : false
</script>

<template>
  <ClientOnly>
    <u-tooltip
      :disabled="!isDisabled"
      text="Event has not started yet"
    >
      <u-button-group :size="md ? 'xs' : 'md'">
        <u-button
          v-for="page in EVENT_PAGES"
          :key="page.label"
          :icon="page.icon"
          :disabled="isDisabled"
          :to="{ name: page.name, params: { name: useChangeCase(name, 'kebabCase').value, tid, year, eid } }"
          color="secondary"
          variant="subtle"
          :ui="{ base: 'text-slate-500 dark:text-slate-300 shadow-xs shadow-emerald-600 dark:shadow-emerald-400 hover:shadow-md hover:shadow-emerald-800 dark:hover:shadow-emerald-400 rounded-full' }"
        >
          {{ page.label }}
        </u-button>
      </u-button-group>
    </u-tooltip>
  </ClientOnly>
</template>
