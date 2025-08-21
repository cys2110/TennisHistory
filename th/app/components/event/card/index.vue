<script setup lang="ts">
defineProps<{ event: EventInterface }>()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1024 })
const smAndDown = breakpoints.smaller("md")
</script>

<template>
  <div :id="`event-${event.id}`">
    <event-card-small
      v-if="smAndDown"
      :event
    />
    <event-card-regular
      v-else
      :event
    />
  </div>
</template>
