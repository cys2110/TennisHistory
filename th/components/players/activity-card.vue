<script setup lang="ts">
const { event, year } = defineProps<{ event: PlayerActivityType; year: string }>()

const earnings = {
  Seed: event.seed,
  Status: event.status,
  Points: event.points,
  Rank: event.rank,
  ...(event.currency && { "Prize Money": `${CURRENCIES[event.currency]}${event.pm}` })
}

const tagColors = {
  Seed: "bg-orange-500 text-orange-800",
  Status: "bg-fuchsia-500 text-fuchsia-800",
  Points: "bg-teal-500 text-teal-800",
  Rank: "bg-blue-500 text-blue-800",
  "Prize Money": "bg-emerald-500 text-emerald-800"
}
</script>

<template>
  <u-page-card
    highlight
    orientation="horizontal"
    :to="{ name: 'tournament', params: { name: useChangeCase(event.name, 'kebabCase').value, tid: event.tid } }"
    :title="event.name"
    :ui="{ container: 'lg:flex lg:flex-row' }"
  >
    <template #description>
      <div class="flex flex-col gap-1">
        <div v-if="event.ename">{{ event.ename }}</div>
        <div>{{ event.dates }}</div>
        <div>
          {{ event.city }}
          <flag-icon :country="event.country" />
        </div>
        <div>{{ event.surface }}</div>
        <div></div>
        <template
          v-for="(value, key) in earnings"
          :key
        >
          <u-badge
            v-if="value"
            :class="tagColors[key]"
            >{{ key }}: {{ value }}</u-badge
          >
        </template>
      </div>
    </template>

    <activity-table
      :event
      :year
    />

    <template #footer>
      <event-buttons
        :name="event.name"
        :tid="event.tid"
        :year
        :eid="event.eid"
      />
    </template>
  </u-page-card>
</template>
