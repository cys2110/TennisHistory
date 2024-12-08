<script setup lang="ts">
import type { Event, Match } from '@/utils/types'

const props = defineProps<{
  event: Pick<Event, 'id' | 'year'> & { rounds: { matches: Pick<Match, 'match_no' | 'winner' | 'loser'>[] }[] }
  id: number
  name: string
}>()
const final = props.event.rounds[0].matches[0]

// router-link params
const eventParams = { year: props.event.year.id, eid: props.event.id }
const matchParams = { ...eventParams, mid: final.match_no }
</script>

<template>
  <Card class="full-card">
    <template #title>
      <router-link class="hover-link font-bold" :to="{ name: 'event', params: eventParams }">
        {{ event.year.id }}
      </router-link>
      <Divider />
    </template>
    <template #content>
      <PlayerRow :player="final.winner.player.player" class="items-center mb-2" />
      <div class="flex justify-center">d.</div>
      <PlayerRow :player="final.loser.player.player" class="items-center mt-2" />
    </template>
    <template #footer>
      <div class="text-center">
        <router-link :to="{ name: 'match', params: matchParams }">
          <WinnerScore :winner="final.winner" :loser="final.loser" />
        </router-link>
      </div>
    </template>
  </Card>
</template>