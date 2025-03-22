<script setup lang="ts">
defineProps<{ event: ArchiveEventType }>()
</script>

<template>
  <div>
    <u-page-card
      highlight
      reverse
      :icon="`flag:${event.locations[0].country.alpha2}-4x3`"
      class="h-full"
      :ui="{ description: 'text-sm flex flex-col gap-1', wrapper: 'order-last' }"
    >
      <div class="relative">
        <nuxt-img
          :src="`/surfaces/${event.surface}.jpg`"
          :alt="event.surface"
          class="opacity-75 rounded-lg"
        />
        <category-avatar
          :category="event.category ?? ''"
          class="absolute top-3 left-3"
        />
      </div>

      <template #title>
        <tournament-link
          :name="event.name"
          :tid="event.tid"
        />
      </template>

      <template #description>
        <div v-if="event.ename">{{ event.ename }}</div>
        <div>{{ event.locations.map(location => location.city).join(" | ") }}</div>
        <div>{{ event.dates }}</div>
      </template>

      <template #footer>
        <event-buttons
          :name="event.name"
          :tid="event.tid"
          :year="event.year"
          :eid="event.eid"
          :start="event.start"
          :draw-type="event.draw_type"
        />
      </template>
    </u-page-card>
  </div>
</template>
