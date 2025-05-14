<script setup lang="ts">
defineProps<{ event: EventCardType }>()
const route = useRoute()
</script>

<template>
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
      <u-tooltip
        :text="event.surface.id"
        :ui="{ content: 'border border-primary' }"
      >
        <nuxt-img
          :src="`/surfaces/${event.surface.surface}.jpg`"
          :alt="event.surface.id"
          class="opacity-75 rounded-lg cursor-pointer"
          @click="
            () =>
              navigateTo({
                name: 'surface',
                params: { id: encodeName(event.surface.id) }
              })
          "
        />
      </u-tooltip>
      <!--Category logo-->
      <category-avatar
        v-if="route.name !== 'category'"
        :category="event.category ?? ''"
        class="absolute top-3 left-3"
      />
      <u-avatar
        v-else
        :src="`/category/${event.category}.svg`"
        :alt="event.category ?? ''"
        size="xl"
        :icon="ICONS.tournament"
        :ui="{ root: 'bg-neutral-300 cursor-pointer', image: 'object-contain' }"
      />
    </div>

    <!--Link to country page-->
    <template #leading>
      <base-link
        type="country"
        :country="event.venues[0].country"
      />
    </template>

    <!--Link to tournament page-->
    <template #title>
      <base-link
        type="tournament"
        :tournament="event.tournament"
      />
    </template>

    <template #description>
      <div v-if="event.name">{{ event.name }}</div>
      <!--Link to venue page-->
      <div
        v-for="venue in event.venues"
        :key="venue.id"
      >
        <base-link
          v-if="route.name !== 'venue'"
          :id="venue.id"
          type="venue"
        >
          {{ venue.name ? `${venue.name}, ${venue.city}` : venue.city }}
        </base-link>
        <span v-else>{{ venue.name ? `${venue.name}, ${venue.city}` : venue.city }}</span>
      </div>
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
</template>
