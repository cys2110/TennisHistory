<script setup lang="ts">
import { PlayerDoublesActivity, PlayerSinglesActivity } from "#components"

const { event, year } = defineProps<{ event: PlayerActivityType; year: string; type: "Singles" | "Doubles"; tour: TourType }>()

const earnings = {
  Seed: event.player.seed,
  "Qualifying Seed": event.player.q_seed,
  Status: event.player.status,
  "Qualifying Status": event.player.q_status,
  Points: event.player.points,
  Rank: event.player.rank,
  ...(event.currency && event.player.pm && { "Prize Money": `${CURRENCIES[event.currency]}${event.player.pm}` })
}

const tagColors = {
  Seed: "bg-doubles-400 text-doubles-800",
  "Qualifying Seed": "bg-success-300 text-success-800",
  Status: "bg-singles-500 text-singles-800",
  "Qualifying Status": "bg-warning-400 text-warning-800",
  Points: "bg-joint-400 text-joint-800",
  Rank: "bg-active-400 text-active-800",
  "Prize Money": "bg-info-500 text-info-800"
}
</script>

<template>
  <u-page-card
    highlight
    :highlight-color="tour === 'ATP' ? 'atp' : 'wta'"
    :ui="{ body: 'w-full', footer: 'flex items-center justify-between w-full' }"
  >
    <template #title>
      <div class="flex justify-between items-center">
        <u-link
          :to="{ name: 'tournament', params: { id: event.tournament.id, name: encodeName(event.tournament.name) } }"
          class="font-semibold text-base hover-link"
        >
          {{ event.tournament.name }}
        </u-link>
        <div v-if="event.name">
          {{ event.name }}
        </div>
      </div>
      <div class="flex justify-between items-center">
        <div>{{ event.dates ?? (tour === "WTA" ? event.wta_dates : event.atp_dates) }}</div>
        <div class="flex items-center gap-2">
          <div>{{ event.venues.map(location => location.city).join(" | ") }}</div>
          <u-link
            :to="{ name: 'country', params: { id: event.venues[0].country.id, name: encodeName(event.venues[0].country.name) } }"
            class="flex items-center"
          >
            <u-icon
              :name="getFlagCode(event.venues[0].country)"
              class="text-xl"
            />
          </u-link>
        </div>
      </div>
      <div
        v-if="event.partner"
        class="flex items-center gap-2 text-sm my-3 w-full justify-end"
      >
        <div>Partner:</div>
        <u-link
          :to="{ name: 'country', params: { id: event.partner.country.id, name: encodeName(event.partner.country.name) } }"
          class="flex items-center"
        >
          <u-icon
            :name="getFlagCode(event.partner.country)"
            class="text-lg"
          />
        </u-link>
        <u-link
          :to="{ name: 'player', params: { id: event.partner.id, name: encodeName(event.partner.name) } }"
          class="hover-link"
        >
          {{ event.partner.name }}
        </u-link>
        <span v-if="event.partner.rank">({{ event.partner.rank }})</span>
      </div>
    </template>

    <template #description>
      <component
        :is="type === 'Singles' ? PlayerSinglesActivity : PlayerDoublesActivity"
        :key="type"
        :matches="event.matches"
        :partner="event.partner"
        :year
        :id="event.id"
        :tournament="event.tournament"
        :tour
      />
    </template>

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
        :year="Number(year)"
        :id="event.id"
      />
    </template>
  </u-page-card>
</template>
