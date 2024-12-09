<script setup lang="ts">
import { CheckCircleTwoTone } from '@ant-design/icons-vue'
import { encodeName, getEntry, headshot } from '@/utils/functions'
import { COLOURS } from '@/utils/variables'
import type { Match } from '@/utils/types'

const props = defineProps<{
  name: string
  id: string
  eid: string
  year: string
  match: Pick<Match, 'p1' | 'p2' | 'incomplete' | 'match_no'> & { winner: { player: { player: { id: string } } } }
}>()

const { p1, p2, incomplete, match_no, winner } = props.match
</script>

<template>
  <Card class="pt-3 px-5 text-xs my-1">
    <template #content>
      <div class="grid grid-cols-9 gap-y-2">
        <div>
          <GetFlag v-if="p1.player" :country="p1.player.player.country.id" />
        </div>
        <div>
          <Avatar v-if="p1.player" style="border: 1px solid #d4d4d8" shape="circle"
            :image="headshot(p1.player.player.id)" />
        </div>
        <div class="col-span-3 flex items-center">
          <router-link v-if="match.p1.player" class="hover-link"
            :to="{ name: 'player', params: { name: encodeName(p1.player.player.full_name), id: p1.player.player.id } }">
            {{ p1.player.player.full_name }}
          </router-link>
          <template v-else>{{ match.incomplete === 'B' ? 'BYE' : 'PLAYER 1' }}</template>
        </div>
        <div v-if="p1.player" class="text-xs flex items-center">{{ getEntry(p1.player) }}</div>
        <div class="flex items-center justify-center">
          <i v-if="winner.player.player.id === p1.player.player.id" class="pi pi-check-circle text-green-500" />
          <Tag v-else-if="p1?.incomplete" class="!bg-red-800" :value="`${p1.incomplete}.`" size="xlarge" />
        </div>
        <div class="col-span-2 flex items-center justify-center">
          <ScoreItem v-if="incomplete !== 'B'" :score="p1" />
        </div>
        <div>
          <GetFlag v-if="p2?.player" :country="p2.player.player.country.id" />
        </div>
        <div>
          <Avatar v-if="p2?.player" style="border: 1px solid #d4d4d8" shape="circle"
            :image="headshot(p2?.player.player.id)" />
        </div>
        <div class="col-span-3 flex items-center">
          <router-link v-if="match.p2?.player" class="hover-link"
            :to="{ name: 'player', params: { name: encodeName(p2.player.player.full_name), id: p2.player.player.id } }">
            {{ p2.player.player.full_name }}
          </router-link>
          <template v-else>{{ match.incomplete === 'B' ? 'BYE' : 'PLAYER 2' }}</template>
        </div>
        <div v-if="p1.player" class="text-xs flex items-center">{{ getEntry(p2?.player) }}</div>
        <div class="flex items-center justify-center">
          <i v-if="winner.player.player.id === p2?.player.player.id" class="pi pi-check-circle text-green-500" />
          <Tag v-else-if="p2?.incomplete" class="!bg-red-800" :value="`${p2.incomplete}.`" size="xlarge" />
        </div>
        <div class="col-span-2 flex items-center justify-center">
          <ScoreItem v-if="incomplete !== 'B'" :score="p2" />
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
          :to="{ name: 'h2h', params: { p1Name: encodeName(p1.player.player.full_name), p1Id: p1.player.player.id, p2Name: encodeName(p2.player.player.full_name), p2Id: p2.player.player.id } }" />
      </div>
    </template>
  </Card>

</template>