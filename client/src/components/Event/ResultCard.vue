<script setup lang="ts">
import { CheckCircleTwoTone } from '@ant-design/icons-vue'
import { encodeName, formatDate, formatTime, getEntry } from '@/utils/functions'
import type { ResultsMatch } from '@/utils/types'
import { COLOURS } from '@/utils/variables'

const props = defineProps<{
  match: ResultsMatch['matches'][0]
  name: string
  id: string
  eid: string
  year: string
}>()
const { date, court, duration_mins, umpire, winner, loser, incomplete, match_no } = props.match

const buttonClass = (disabled: boolean) => {
  return disabled ? 'border-zinc-400 hover:!text-zinc-400 text-zinc-400 cursor-not-allowed' : 'border-zinc-300'
}
</script>

<template>
  <a-card class="full-card p-1">

    <template #title>
      <div v-if="date">{{ formatDate(date) }}</div>
      <div v-if="court">{{ court }}</div>
    </template>

    <template #extra>
      <div class="text-right">{{ duration_mins ? formatTime(duration_mins) : '0:00' }}</div>
      <div v-if="umpire" class="text-right">{{ umpire.id }}</div>
    </template>

    <a-row class="mb-2">
      <a-col :span="19">
        <PlayerRow :player="winner.player.player" :entry="getEntry(winner.player)" />
      </a-col>
      <a-col :span="2">
        <CheckCircleTwoTone :twoToneColor="COLOURS.green600" />
      </a-col>
      <a-col :span="3" class="flex">
        <ScoreItem v-if="incomplete !== 'B'" :score="winner" />
      </a-col>
    </a-row>

    <a-row class="mt-2">
      <a-col :span="19">
        <PlayerRow v-if="loser?.player" :player="loser.player.player" :entry="getEntry(loser.player)" />
        <div v-else class="text-center w-3/4 text-zinc-400">BYE</div>
      </a-col>
      <a-col :span="2">
        <a-tag v-if="loser?.incomplete" :color="COLOURS.red600">{{ loser.incomplete }}.</a-tag>
      </a-col>
      <a-col :span="3" class="flex">
        <ScoreItem v-if="loser?.player" :score="loser" />
      </a-col>
    </a-row>

    <template #actions>
      <div class="flex justify-center">
        <div :class="buttonClass(!!incomplete)" class="border-[1.5px] rounded-full px-4 border-dashed">
          <template v-if="!!incomplete">Stats</template>
          <template v-else>
            <router-link class="!text-zinc-300 hover:!text-zinc-400" :to="{ name: 'match', params: { mid: match_no } }">
              Stats
            </router-link>
          </template>
        </div>
      </div>
      <div class="flex justify-center">
        <div :class="buttonClass(incomplete === 'B')" class="border-[1.5px] rounded-full px-4 border-dashed">
          <template v-if="incomplete === 'B'">H2H</template>
          <template v-else>
            <router-link class="!text-zinc-300 hover:!text-zinc-400"
              :to="{ name: 'h2h', params: { p1Name: encodeName(winner.player.player.full_name), p1Id: winner.player.player.id, p2Name: encodeName(loser.player.player.full_name), p2Id: loser.player.player.id } }">
              H2H
            </router-link>
          </template>
        </div>
      </div>
    </template>
  </a-card>
</template>