<script setup lang="ts">
defineProps<{ events: { title: string; events: EventCardType[] }[] }>()

const breakpoints = useBreakpoints(breakpointsTailwind)
const mdAndUp = breakpoints.greaterOrEqual("md")
</script>

<template>
  <u-stepper
    :items="events"
    :linear="false"
    :size="mdAndUp ? 'md' : 'xs'"
    orientation="vertical"
    :ui="{ header: 'mr-10', separator: 'min-h-4', item: 'my-1.5' }"
  >
    <template #indicator="{ item }">{{ item.events.length }}</template>
    <template #content="{ item }">
      <u-page-grid class="lg:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-4">
        <event-card
          v-for="event in item.events"
          :key="event.id"
          :event
        />
      </u-page-grid>
    </template>
  </u-stepper>
</template>
