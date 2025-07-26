<script setup lang="ts">
defineProps<{ event: EventInterface }>()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1280 })
const smAndDown = breakpoints.smaller("md")
</script>

<template>
  <div :id="`event-${event.id}`">
    <tournament-calendar-card-small
      v-if="smAndDown"
      :event
    />
    <tournament-calendar-card-regular
      v-else
      :event
    />
  </div>
</template>
