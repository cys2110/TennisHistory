<script setup lang="ts">
import { encodeName, formatDate, formatTime, getEntry, headshot } from '@/utils/functions'
import type { Match } from '@/utils/types'
import GetFlag from '../Global/GetFlag.vue';

const props = defineProps<{
  match: Pick<Match, 'date' | 'court' | 'duration_mins' | 'umpire' | 'winner' | 'loser' | 'incomplete' | 'match_no'>
  name: string
  id: string
  eid: string
  year: string
}>()
const { date, court, duration_mins, umpire, winner, loser, incomplete, match_no } = props.match
</script>

<template>
  <Card class="full-card pt-3 px-5">
    <template #header>
      <div class="flex justify-between">
        <div class="flex flex-col">
          <div v-if="date">{{ formatDate(date) }}</div>
          <div v-if="court">{{ court }}</div>
        </div>
        <div class="flex flex-col">
          <div class="text-right">{{ duration_mins ? formatTime(duration_mins) : '0:00' }}</div>
          <div v-if="umpire" class="text-right">{{ umpire.id }}</div>
        </div>
      </div>
      <Divider />
    </template>
    <template #content>
      <div>
        <div class="grid grid-cols-9">
          <div>
            <GetFlag :country="winner.player.player.country.id" />
          </div>
          <div>
            <Avatar style="border: 1px solid #d4d4d8" shape="circle" :image="headshot(winner.player.player.id)" />
          </div>
          <div class="col-span-3 flex items-center">
            <router-link class="hover-link"
              :to="{ name: 'player', params: { name: encodeName(winner.player.player.full_name), id: winner.player.player.id } }">
              {{ winner.player.player.full_name }}
            </router-link>
          </div>
          <div class="text-xs flex items-center">{{ getEntry(winner.player) }}</div>
          <div class="flex items-center justify-center"><i class="pi pi-check-circle text-green-500" /></div>
          <div class="col-span-2 flex items-center justify-center">
            <ScoreItem v-if="incomplete !== 'B'" :score="winner" />
          </div>
        </div>
        <div class="grid grid-cols-9">
          <div>
            <GetFlag v-if="loser?.player" :country="loser.player.player.country.id" />
          </div>
          <div>
            <Avatar v-if="loser?.player" style="border: 1px solid #d4d4d8" shape="circle"
              :image="headshot(loser.player.player.id)" />
          </div>
          <div class="col-span-3 flex items-center">
            <router-link v-if="loser?.player" class="hover-link"
              :to="{ name: 'player', params: { name: encodeName(loser.player.player.full_name), id: loser.player.player.id } }">
              {{ loser.player.player.full_name }}
            </router-link>
            <template v-else>BYE</template>
          </div>
          <div class="text-xs flex items-center">{{ loser?.player ? getEntry(loser.player) : null }}</div>
          <div class="flex items-center justify-center">
            <Tag v-if="loser?.incomplete" class="!bg-red-800" :value="`${loser.incomplete}.`" size="xlarge" />
          </div>
          <div class="col-span-2 flex items-center">
            <ScoreItem v-if="incomplete !== 'B'" :score="loser" />
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <Divider />
      <div class="flex justify-evenly">
        <Button v-if="!!incomplete" label="Stats" size="small"
          class="!cursor-not-allowed !border-zinc-400 !text-zinc-400" variant="outlined" rounded raised disabled />
        <Button v-else as="router-link" label="Stats" size="small"
          class="!border-zinc-400 !text-zinc-400 hover:!border-zinc-300 hover:!text-zinc-300" variant="outlined" rounded
          raised :to="{ name: 'match', params: { mid: match_no } }" />
        <Button v-if="incomplete === 'B'" label="H2H" size="small"
          class="!border-zinc-400 !text-zinc-400 !cursor-not-allowed" variant="outlined" rounded raised disabled />
        <Button v-else as="router-link" label="H2H" size="small"
          class="!border-zinc-400 !text-zinc-400 hover:!border-zinc-300 hover:!text-zinc-300" variant="outlined" rounded
          raised
          :to="{ name: 'h2h', params: { p1Name: encodeName(winner.player.player.full_name), p1Id: winner.player.player.id, p2Name: encodeName(loser.player.player.full_name), p2Id: loser.player.player.id } }" />
      </div>
    </template>
  </Card>
</template>