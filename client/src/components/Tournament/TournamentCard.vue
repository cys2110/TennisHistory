<script setup lang="ts">
import type { Event, Match } from '@/utils/types'

// Variables
const props = defineProps<{
  event: Pick<Event, 'id' | 'year'> & { rounds: { matches: Pick<Match, 'match_no' | 'winner' | 'loser'>[] }[] }
  id: number
  name: string
}>()
const { id: eid, year: { id: year } } = props.event
const { winner, loser, match_no: mid } = props.event.rounds[0].matches[0]

// router-link params
const eventParams = { year, eid }
const matchParams = { ...eventParams, mid }
</script>

<template>
  <card class="full-card">
    <template #title>
      <div>
        <router-link class="hover-link font-bold text-xl" :to="{ name: 'event', params: eventParams }">
          {{ event.year.id }}
        </router-link>
      </div>
      <Divider />
    </template>
    <template #content>
      <div class="flex gap-2 items-center mb-2">
        <GetFlag :country="winner.player.player.country.id" />
        <Avatar shape="circle" />
        <router-link class="hover-link text-base"
          :to="{ name: 'player', params: { id: winner.player.player.id, name: useChangeCase(winner.player.player.full_name, 'snakeCase').value } }">{{
            winner.player.player.full_name }}</router-link>
      </div>
      <div class="flex justify-center">d.</div>
      <PlayerRow :player="loser.player.player" class="mt-2" />
    </template>
    <template #footer>
      <div class="hover-link mx-auto">
        <router-link class="text-base" :to="{ name: 'match', params: matchParams }">
          <WinnerScore :winner :loser />
        </router-link>
      </div>
    </template>
  </card>
</template>