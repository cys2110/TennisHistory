<script setup lang="ts">
import { CheckCircleTwoTone } from '@ant-design/icons-vue'
import { encodeName, getEntry } from '@/utils/functions'
import { COLOURS } from '@/utils/variables'
import { DrawMatch } from '@/utils/types'

const props = defineProps<{
  name: string
  id: string
  eid: string
  year: string
  match: DrawMatch['matches'][0]
}>()
</script>

<template>
  <a-card class="my-1">
    <a-row>
      <a-col :span="19">
        <PlayerRow
          v-if="match.p1?.player"
          :player="match.p1.player.player"
          :entry="getEntry(match.p1.player)"
        />
        <div v-else-if="match.incomplete === 'B'">BYE</div>
        <div v-else>PLAYER 1</div>
      </a-col>
      <a-col :span="2">
        <CheckCircleTwoTone
          v-if="match.winner.player.player.id === match.p1?.player?.player.id"
          :twoToneColor="COLOURS.green600"
        />
        <a-tag v-if="match.p1?.incomplete" :color="COLOURS.red600">{{ match.p1.incomplete }}</a-tag>
      </a-col>
      <a-col :span="3">
        <ScoreItem v-if="match.p1" :score="match.p1" />
      </a-col>
    </a-row>
    <a-row class="mt-5">
      <a-col :span="19">
        <PlayerRow
          v-if="match.p2?.player"
          :player="match.p2.player.player"
          :entry="getEntry(match.p2.player)"
        />
        <div v-else-if="match.incomplete === 'B'">BYE</div>
        <div v-else>PLAYER 2</div>
      </a-col>
      <a-col :span="2">
        <CheckCircleTwoTone
          v-if="match.winner.player.player.id === match.p2?.player?.player.id"
          :twoToneColor="COLOURS.green600"
        />
        <a-tag v-if="match.p2?.incomplete" :color="COLOURS.red600">{{ match.p2.incomplete }}</a-tag>
      </a-col>
      <a-col :span="3">
        <ScoreItem v-if="match.p2" :score="match.p2" />
      </a-col>
    </a-row>
    <template #actions>
      <div class="flex justify-center">
        <div
          v-if="!!match.incomplete"
          class="border-zinc-400 border-[1.5px] rounded-full px-4 border-dashed hover:!text-zinc-400 text-zinc-400 cursor-not-allowed"
        >
          Stats
        </div>
        <div v-else class="border-zinc-300 border-[1.5px] rounded-full px-4 border-dashed">
          <router-link
            class="!text-zinc-300 hover:!text-zinc-400"
            :to="{ name: 'match', params: { mid: match.match_no } }"
          >
            Stats
          </router-link>
        </div>
      </div>
      <div class="flex justify-center">
        <div
          v-if="match.incomplete === 'B'"
          class="border-zinc-400 border-[1.5px] rounded-full px-4 border-dashed hover:!text-zinc-400 text-zinc-400 cursor-not-allowed"
        >
          H2H
        </div>
        <div v-else class="border-zinc-300 border-[1.5px] rounded-full px-4 border-dashed">
          <router-link
            class="!text-zinc-300 hover:!text-zinc-400"
            :to="{
              name: 'h2h',
              params: {
                p1Name: encodeName(match.p1.player.player.full_name),
                p1Id: match.p1.player.player.id,
                p2Name: encodeName(match.p2.player.player.full_name),
                p2Id: match.p2.player.player.id,
              },
            }"
          >
            H2H
          </router-link>
        </div>
      </div>
    </template>
  </a-card>
</template>
