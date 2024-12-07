<script setup>
import { encodeName, formatCurrency, formattedDates } from '@/utils/functions'
import { SURFACES } from '@/utils/variables'

const props = defineProps(['event', 'id', 'name'])
const eventDetails = props.event.scores[0].match.round.event
const earnings = {
  Seed: props.event.seed,
  Status: props.event.status,
  Points: props.event.points,
  Rank: props.event.rank,
  'Prize Money': formatCurrency(eventDetails.currency, props.event.pm),
}
const actionButtons = [
  { title: 'Details', name: 'event' },
  { title: 'Results', name: 'results' },
  { title: 'Draw', name: 'draw' },
]
const tournamentParams = {
  name: encodeName(eventDetails.tournament.name),
  id: eventDetails.tournament.id,
}
const eventParams = {
  ...tournamentParams,
  year: eventDetails.year.id,
  eid: eventDetails.id,
}
</script>

<template>
  <a-card :id="eventDetails.tournament.name" class="p-3">
    <template #title>
      <div>
        <span v-if="eventDetails.sponsor_name">{{ eventDetails.sponsor_name }} | </span>
        <router-link class="hover-link" :to="{ name: 'tournament', params: tournamentParams }">{{
          eventDetails.tournament.name
        }}</router-link>
      </div>
      <div>
        {{ formattedDates(eventDetails.start_date, eventDetails.end_date) }} |
        {{ eventDetails.venue.city }}, {{ eventDetails.venue.country.name }}
      </div>
    </template>
    <template #extra>
      <div class="text-right">
        <div>{{ eventDetails.category }}</div>
        <div>{{ SURFACES[eventDetails.surface.id] }}</div>
      </div>
    </template>
    <a-row class="text-center">
      <a-col :span="3" class="text-left font-bold">ROUND</a-col>
      <a-col :span="1"></a-col>
      <a-col :span="8" class="font-bold">OPPONENT</a-col>
      <a-col :span="4" class="font-bold">RANK</a-col>
      <a-col :span="5" class="text-left font-bold">SCORE</a-col>
      <a-col :span="3"></a-col>
    </a-row>
    <ActivityRow
      v-for="(match, index) in event.scores"
      :key="index"
      :match="match.match"
      :event="eventDetails"
      :name
      :id
      class="my-2"
    />
    <a-card-meta>
      <template #description>
        <div class="flex mt-2">
          <template v-for="(value, key) in earnings">
            <div v-if="value" class="mr-2">{{ key }}: {{ value }}</div>
          </template>
        </div>
      </template>
    </a-card-meta>
    <template #actions>
      <a-button
        v-for="button in actionButtons"
        :key="button.name"
        type="dashed"
        :ghost="true"
        shape="round"
        size="small"
        class="!border-zinc-300 hover:!border-zinc-400"
      >
        <router-link
          class="!text-zinc-300 hover:!text-zinc-400"
          :to="{ name: button.name, params: eventParams }"
        >
          {{ button.title }}</router-link
        >
      </a-button>
    </template>
  </a-card>
</template>
