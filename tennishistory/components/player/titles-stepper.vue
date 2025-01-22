<script setup lang="ts">
defineProps<{ events: TitlesFinalsType[] }>()
</script>

<template>
  <u-stepper
    :items="events"
    :linear="false"
  >
    <template #indicator="{ item }">{{ item.events.length }}</template>
    <template #content="{ item }">
      <u-page-grid>
        <u-card
          v-for="event in item.events"
          :key="event.eid"
        >
          <template #header>
            <nuxt-link
              class="hover-link"
              :to="{ name: 'tournament', params: { name: useChangeCase(event.tname, 'kebabCase').value, tid: event.tid } }"
            >
              {{ event.tname }}
            </nuxt-link>
          </template>
          <div>
            <div>{{ event.date }}</div>
            <div>{{ event.surface }}</div>
          </div>
          <template #footer>
            <event-buttons
              :name="event.tname"
              :tid="event.tid"
              :year="item.title"
              :eid="event.eid"
            />
          </template>
        </u-card>
      </u-page-grid>
    </template>
  </u-stepper>
</template>
