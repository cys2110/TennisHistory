<script setup lang="ts">
defineProps<{ event: EventCardType }>()
</script>

<template>
  <div>
    <!--Need the parent div to pass the id to the card for hash scrolling-->
    <u-page-card
      highlight
      reverse
      :ui="{ root: 'h-full', description: 'text-sm flex flex-col gap-1', wrapper: 'order-last flex flex-col items-start', body: 'flex-1' }"
    >
      <!--Need 'order-last' class for smaller screens and 'h-full' to make all cards the same height-->
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

      <!--Link to country page-->
      <template #leading>
        <country-link :country="event.venues[0].country" />
      </template>

      <!--Link to tournament page-->
      <template #title>
        <tournament-link
          :name="event.name"
          :id="event.tid"
        />
      </template>

      <template #description>
        <div v-if="event.ename">{{ event.ename }}</div>
        <!--Link to venue page-->
        <venue-link
          v-for="venue in event.venues"
          :key="venue.id"
          :venue
        />
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
