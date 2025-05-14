<script setup lang="ts">
const { event, year } = defineProps<{ event: PlayerActivityType; year: string }>()

const earnings = {
  Seed: event.player.seed,
  Status: event.player.status,
  Points: event.player.points,
  Rank: event.player.rank,
  ...(event.currency && event.player.pm && { "Prize Money": `${CURRENCIES[event.currency]}${event.player.pm}` })
}

const tagColors = {
  Seed: "bg-orange-400 text-orange-800",
  Status: "bg-teal-500 text-teal-800",
  Points: "bg-fuchsia-400 text-fuchsia-800",
  Rank: "bg-blue-400 text-blue-800",
  "Prize Money": "bg-green-500 text-green-800"
}
</script>

<template>
  <u-card :ui="{ footer: 'flex flex-col md:flex-row items-center gap-3' }">
    <template #header>
      <div class="flex justify-between items-center">
        <base-link
          type="tournament"
          :tournament="event.tournament"
          class="font-semibold text-base"
        />
        <div v-if="event.name">
          {{ event.name }}
        </div>
      </div>
      <div class="flex justify-between items-center">
        <div>{{ event.dates }}</div>
        <div class="flex items-center gap-2">
          <div>{{ event.venues.map(location => location.city).join(" | ") }}</div>
          <base-link
            type="country"
            :country="event.venues[0].country"
          />
        </div>
      </div>
    </template>

    <activity-matches-table
      :matches="event.matches"
      :year
      :id="event.id"
      :tournament="event.tournament"
    />

    <template #footer>
      <div class="flex gap-1 gap-y-2 flex-wrap justify-center md:justify-start">
        <template
          v-for="(value, key) in earnings"
          :key
        >
          <u-badge
            v-if="value"
            class="font-semibold"
            :class="tagColors[key]"
          >
            {{ key }}: {{ value }}
          </u-badge>
        </template>
      </div>
      <event-buttons
        :tournament="event.tournament"
        :year="year"
        :id="event.id"
        :draw_type="event.draw_type"
      />
    </template>
  </u-card>
</template>
