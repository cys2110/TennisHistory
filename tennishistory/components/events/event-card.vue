<script setup lang="ts">
defineProps<{ event: EventCardType }>()
</script>

<template>
  <div>
    <!--Need the parent div to pass the id to the card for hash scrolling-->
    <u-page-card
      highlight
      reverse
      :ui="{
        root: 'h-full',
        description: 'text-sm flex flex-col gap-1',
        wrapper: 'order-last flex flex-col items-start',
        body: 'flex-1'
      }"
    >
      <!--Need 'order-last' class for smaller screens and 'h-full' to make all cards the same height-->
      <div class="relative">
        <nuxt-img
          :src="`/surfaces/${event.surface}.jpg`"
          :alt="event.surface"
          class="opacity-75 rounded-lg"
        />
        <!--Category logo-->
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
        <tournament-link :tournament="event.tournament" />
      </template>

      <template #description>
        <div v-if="event.name">{{ event.name }}</div>
        <!--Link to venue page-->
        <base-link
          v-for="venue in event.venues"
          :key="venue.id"
          :id="venue.id"
          type="venue"
        >
          {{ venue.name ? `${venue.name}, ${venue.city}` : venue.city }}
        </base-link>
        <div>{{ event.dates }}</div>
      </template>

      <template #footer>
        <event-buttons
          :tournament="event.tournament"
          :year="event.year"
          :id="event.id"
          :start_date="event.start_date"
          :draw_type="event.draw_type"
        />
      </template>
    </u-page-card>
  </div>
</template>
