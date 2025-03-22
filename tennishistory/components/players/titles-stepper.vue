<script setup lang="ts">
defineProps<{ events: { title: string; events: Pick<EventInterface, "eid" | "tid" | "name" | "surface" | "dates" | "draw_type">[] }[] }>()

const breakpoints = useBreakpoints(breakpointsTailwind)
const mdAndUp = breakpoints.greaterOrEqual("md")
</script>

<template>
  <u-stepper
    :items="events"
    :linear="false"
    :size="mdAndUp ? 'md' : 'xs'"
    :orientation="mdAndUp ? 'horizontal' : 'vertical'"
  >
    <template #indicator="{ item }">{{ item.events.length }}</template>

    <template #content="{ item }">
      <u-page-grid class="2xl:grid-cols-5 mt-5">
        <u-page-card
          v-for="event in item.events"
          :key="event.eid"
          spotlight
          variant="outline"
          class="w-full"
          :ui="{ description: 'text-sm' }"
        >
          <template #title>
            <tournament-link
              :name="event.name"
              :tid="event.tid"
            />
          </template>

          <template #description>
            <div>{{ event.dates }}</div>
            <div>{{ event.surface }}</div>
          </template>

          <template #footer>
            <event-buttons
              :name="event.name"
              :tid="event.tid"
              :year="item.title"
              :eid="event.eid"
              :draw-type="event.draw_type"
            />
          </template>
        </u-page-card>
      </u-page-grid>
    </template>
  </u-stepper>
</template>
