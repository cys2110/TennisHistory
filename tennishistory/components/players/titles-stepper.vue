<script setup lang="ts">
defineProps<{ events: { title: string; events: Pick<EventInterface, "eid" | "tid" | "name" | "surface" | "dates" | "draw_type">[] }[] }>()
</script>

<template>
  <u-stepper
    :items="events"
    :linear="false"
  >
    <template #indicator="{ item }">{{ item.events.length }}</template>

    <template #content="{ item }">
      <u-page-grid class="2xl:grid-cols-4">
        <u-page-card
          v-for="event in item.events"
          :key="event.eid"
          spotlight
          variant="outline"
          class="w-fit"
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
