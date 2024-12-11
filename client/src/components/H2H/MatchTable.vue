<script setup lang="ts">
import { encodeName, headshot } from '@/utils/functions'
import { COLOURS, SURFACES } from '@/utils/variables'
import WinnerScore from '../Global/WinnerScore.vue'
import { type Match, Surface } from '@/utils/types'

const props = defineProps<{
  matches: Pick<Match, 'match_no' | 'round' | 'winner' | 'loser'>[]
}>()
</script>

<template>
  <DataTable :value="matches" size="small" stripedRows class="my-5">
    <Column field="round.event.year.id" header="Year" :sortable="true" class="!text-center">
      <template #sorticon>
        <i class="pi pi-sort !text-zinc-400" />
      </template>
      <template #body="{ data }">
        <router-link class="hover-link"
          :to="{ name: 'event', params: { name: encodeName(data.round.event.tournament.name), id: data.round.event.tournament.id, year: data.round.event.year.id, eid: data.round.event.id } }">{{
            data.round.event.year.id }}</router-link>
      </template>
    </Column>
    <Column field="winner.player.player.last_name" header="Winner" :sortable="true" class="!text-center">
      <template #sorticon>
        <i class="pi pi-sort !text-zinc-400" />
      </template>
      <template #body="{ data }">
        <Avatar style="border: 1px solid #d4d4d8" shape="circle" :image="headshot(data.winner.player.player.id)" />
      </template>
    </Column>
    <Column field="round.event.tournament" header="Event" :sortable="true" class="!text-center">
      <template #sorticon>
        <i class="pi pi-sort !text-zinc-400" />
      </template>
      <template #body="{ data }">
        <router-link class="hover-link"
          :to="{ name: 'tournament', params: { name: encodeName(data.round.event.tournament.name), id: data.round.event.tournament.id } }">{{
            data.round.event.tournament.name }}</router-link>
      </template>
    </Column>
    <Column field="round.round" header="Round" :sortable="true" class="!text-center">
      <template #sorticon>
        <i class="pi pi-sort !text-zinc-400" />
      </template>
    </Column>
    <Column field="round.event.surface.id" header="Surface" :sortable="true" class="!text-center">
      <template #sorticon>
        <i class="pi pi-sort !text-zinc-400" />
      </template>
      <template #body="{ data }">{{ SURFACES[data.round.event.surface.id as Surface] }}</template>
    </Column>
    <Column header="Score">
      <template #body="{ data }">
        <router-link class="hover-link"
          :to="{ name: 'match', params: { name: encodeName(data.round.event.tournament.name), id: data.round.event.tournament.id, year: data.round.event.year.id, eid: data.round.event.id, mid: data.match_no } }">
          <WinnerScore :winner="data.winner" :loser="data.loser" />
        </router-link>
      </template>
    </Column>
  </DataTable>
</template>

<style scoped>
:deep(.p-datatable-column-header-content) {
  display: flex;
  justify-content: center;
}
</style>