<script setup lang="ts">
import { encodeName, formatDate, formattedDates, formatTime, getEntry, headshot } from '@/utils/functions'
import type { Match } from '@/utils/types';
import { SURFACES } from '@/utils/variables'

const props = defineProps<{
  match: Match
}>()
const { date, round, court, duration_mins, umpire, p1, p2, winner } = props.match

const fieldsetItems = [
  { label: 'Date(s)', value: date ? formatDate(date) : formattedDates(round.event.start_date, round.event.end_date) },
  { label: 'Surface', value: SURFACES[round.event.surface.id] ?? '—' },
  { label: 'Court', value: court ?? '—' },
  { label: 'Duration', value: duration_mins ? formatTime(duration_mins) : '—' },
  { label: 'Umpire', value: umpire?.id ?? '—' },
]
</script>

<template>
  <TabPanel value="0">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5 mt-5">
      <Fieldset v-for="item in fieldsetItems" :key="item.label" :legend="item.label">{{ item.value }}</Fieldset>
      <Fieldset legend="Related pages">
        <Button as="router-link" label="H2H" size="small"
          class="!border-cyan-600 !text-cyan-600 hover:!border-cyan-500 hover:!text-cyan-500" variant="outlined" rounded
          raised
          :to="{ name: 'h2h', params: { p1Name: encodeName(p1.player.player.full_name), p1Id: p1.player.player.id, p2Name: encodeName(p2.player.player.full_name), p2Id: p2.player.player.id } }" />
        <Button as="router-link" :label="p1.player.player.full_name" size="small"
          class="!border-cyan-600 !text-cyan-600 hover:!border-cyan-500 hover:!text-cyan-500" variant="outlined" rounded
          raised
          :to="{ name: 'player', params: { name: encodeName(p1.player.player.full_name), id: p1.player.player.id } }" />
        <Button as="router-link" :label="p2.player.player.full_name" size="small"
          class="!border-cyan-600 !text-cyan-600 hover:!border-cyan-500 hover:!text-cyan-500" variant="outlined" rounded
          raised
          :to="{ name: 'player', params: { name: encodeName(p2.player.player.full_name), id: p2.player.player.id } }" />
      </Fieldset>
    </div>
    <Card class="mt-5 w-1/2 mx-auto">
      <template #content>
        <div class="grid grid-cols-8 gap-3">
          <div>
            <GetFlag :country="p1.player.player.country.id" />
          </div>
          <div>
            <Avatar style="border: 1px solid #d4d4d8" shape="circle" :image="headshot(p1.player.player.id)" />
          </div>
          <div class="col-span-2 flex items-center">{{ p1.player.player.full_name }}</div>
          <div v-if="p1.player.seed || p1.player.status" class="text-xs flex items-center">{{ getEntry(p1.player) }}
          </div>
          <div class="flex items-center">
            <i v-if="winner.player.player.id === p1.player.player.id" class="pi pi-check-circle text-green-500" />
            <Tag v-else-if="p1.incomplete" class="!bg-red-800" :value="`${p1.incomplete}.`" />
          </div>
          <div class="col-span-2">
            <ScoreItem :score="p1" />
          </div>
          <div>
            <GetFlag :country="p2.player.player.country.id" />
          </div>
          <div>
            <Avatar style="border: 1px solid #d4d4d8" shape="circle" :image="headshot(p2.player.player.id)" />
          </div>
          <div class="col-span-2 flex items-center">{{ p2.player.player.full_name }}</div>
          <div v-if="p2.player.seed || p2.player.status" class="text-xs flex items-center">{{ getEntry(p2.player) }}
          </div>
          <div class="flex items-center">
            <i v-if="winner.player.player.id === p2.player.player.id" class="pi pi-check-circle text-green-500" />
            <Tag v-else-if="p2.incomplete" class="!bg-red-800" :value="`${p2.incomplete}.`" />
          </div>
          <div class="col-span-2">
            <ScoreItem :score="p2" />
          </div>
        </div>
      </template>
    </Card>
  </TabPanel>
</template>