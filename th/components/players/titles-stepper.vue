<script setup lang="ts">
defineProps<{ events: TitlesAndFinalsType[] }>()
</script>

<template>
  <u-stepper
    :items="events"
    :linear="false"
    class="my-5"
  >
    <template #indicator="{ item }">{{ item.events.length }}</template>

    <template #content="{ item }">
      <u-page-grid>
        <u-page-card
          v-for="event in item.events"
          :key="event.eid"
          :title="event.name"
          :to="{ name: 'tournament', params: { name: useChangeCase(event.name, 'kebabCase').value, tid: event.tid } }"
          highlight
        >
          <template #description>
            <div>{{ event.date }}</div>
            <div>{{ event.surface }}</div>
          </template>

          <template #footer>
            <event-buttons
              :name="event.name"
              :tid="event.tid"
              :year="item.title"
              :eid="event.eid"
            />
          </template>
        </u-page-card>
      </u-page-grid>
    </template>
  </u-stepper>
</template>
