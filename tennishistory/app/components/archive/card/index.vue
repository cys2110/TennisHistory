<script setup lang="ts">
defineProps<{ event: EventInterface }>()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1024 })
const smAndDown = breakpoints.smaller("md")
</script>

<template>
  <div :id="`event-${event.id}`">
    <archive-card-small
      v-if="smAndDown"
      :event
    />
    <archive-card-regular
      v-else
      :event
    />
  </div>
</template>
