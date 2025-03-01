<script setup lang="ts">
defineProps<{ event: EventCard }>()
</script>

<template>
  <u-page-card
    :id="`event-${event.eid}`"
    highlight
    reverse
    :icon="`flag:${event.country.alpha2}-4x3`"
  >
    <template #title>
      <nuxt-link
        class="hover-link"
        :to="{ name: 'tournament', params: { name: useChangeCase(event.name, 'kebabCase').value, tid: event.tid } }"
        prefetch-on="interaction"
      >
        {{ event.name }}
      </nuxt-link>
    </template>

    <template #description>
      <div
        v-if="event.ename"
        class="text-sm"
      >
        {{ event.ename }}
      </div>
      <div class="flex gap-2 items-center text-sm">{{ event.city }}</div>
      <div class="text-sm">{{ event.dates }}</div>
    </template>

    <div class="relative">
      <nuxt-img
        :src="`/surfaces/${event.surface ?? 'Hard'}.jpg`"
        :alt="event.surface"
        loading="lazy"
        class="opacity-75 rounded-lg"
      />
      <category-avatar
        v-if="event.category"
        :category="event.category"
        class="absolute top-3 left-3"
      />
    </div>

    <template #footer>
      <event-buttons
        :name="event.name"
        :tid="event.tid"
        :year="event.year"
        :eid="event.eid"
        :start="event.start"
      />
    </template>
  </u-page-card>
</template>
