<script setup lang="ts">
import type { Event, Match } from '@/utils/types'

// Styling
const dividerTheme = { horizontalMargin: '1rem' }

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
  <Panel class="md:px-5 full-card">
    <template #header>
      <div class="flex flex-col w-full">
        <div>
          <router-link class="hover-link font-bold text-xl" :to="{ name: 'event', params: eventParams }">
            {{ event.year.id }}
          </router-link>
        </div>
        <Divider :dt="dividerTheme" />
      </div>
    </template>
    <PlayerRow :player="winner.player.player" class="mb-2" />
    <div class="flex justify-center">d.</div>
    <PlayerRow :player="loser.player.player" class="mt-2" />
    <template #footer>
      <div class="text-center">
        <router-link :to="{ name: 'match', params: matchParams }">
          <WinnerScore :winner :loser />
        </router-link>
      </div>
    </template>
  </Panel>
</template>