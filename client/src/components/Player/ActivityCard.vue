<script setup lang="ts">
import { encodeName, formatCurrency, formattedDates, headshot } from '@/utils/functions'
import type { Entry, Score } from '@/utils/types';
import { SURFACES } from '@/utils/variables'

const props = defineProps<{
  id: string
  name: string
  event: Entry
}>()
console.log(props.event)
const eventDetails = props.event.scores[0].match.round.event

const tableColors = {
  rowBackground: 'transparent'
}

const earnings = {
  Seed: props.event.seed,
  Status: props.event.status,
  Points: props.event.points,
  Rank: props.event.rank,
  'Prize Money': eventDetails.currency ? formatCurrency(eventDetails.currency, props.event.pm) : null,
}
const tagColors = {
  Seed: '!bg-orange-500',
  Status: '!bg-fuchsia-500',
  Points: '!bg-teal-500',
  Rank: '!bg-blue-500',
  'Prize Money': '!bg-emerald-500',
}

const getPlayerDetails = (p1: Score, p2: Score, type: string) => {
  switch (type) {
    case 'country':
      return p1.player.player.id === props.id ? p2.player.player.country.id : p1.player.player.country.id
    case 'id':
      return p1.player.player.id === props.id ? p2.player.player.id || '' : p1.player.player.id || ''
    case 'name':
      return p1.player.player.id === props.id ? p2.player.player.full_name : p1.player.player.full_name
    case 'rank':
      return p1.player.player.id === props.id ? p2.player.rank : p1.player.rank
    default:
      return '—'
  }
}

const iconClass = (winner: string, player: string) => {
  return winner === player ? 'pi pi-check-circle text-green-600' : 'pi pi-times-circle text-red-600'
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

const getPlayerParams = (p1: { player: { player: { id: string, full_name: string } } } | null, p2: { player: { player: { id: string, full_name: string } } } | null) => {
  if (p1?.player) {
    return {
      name: encodeName(p1.player.player.full_name),
      id: p1.player.player.id,
    }
  } else if (p2?.player) {
    return {
      name: encodeName(p2?.player?.player.full_name),
      id: p2?.player?.player.id,
    }
  }
}
</script>

<template>
  <Card class="p-5 my-10">
    <template #header>
      <div class="flex justify-between">
        <div class="flex flex-col">
          <div>
            <span v-if="eventDetails.sponsor_name">{{ eventDetails.sponsor_name }} | &nbsp;</span>
            <span>
              <router-link class="hover-link font-bold text-xl"
                :to="{ name: 'tournament', params: tournamentParams }">{{
                  eventDetails.tournament.name }}</router-link>
            </span>
          </div>
          <div>
            {{ formattedDates(eventDetails.start_date, eventDetails.end_date) }} |
            {{ eventDetails.venue.city }}
            <GetFlag :country="eventDetails.venue.country.id" />
          </div>
        </div>
        <div class="flex flex-col items-end">
          <div>{{ eventDetails.category }}</div>
          <div>{{ SURFACES[eventDetails.surface.id] }}</div>
        </div>
      </div>
      <Divider />
    </template>

    <template #content>
      <DataTable :value="event.scores" size="small" :dt="tableColors">
        <Column field="match.round.round" header="ROUND">
        </Column>
        <Column>
          <template #body="{ data }">
            <GetFlag v-if="data.match.incomplete !== 'B'"
              :country="getPlayerDetails(data.match.p1, data.match.p2, 'country')" />
          </template>
        </Column>
        <Column>
          <template #body="{ data }">
            <Avatar v-if="data.match.incomplete !== 'B'" style="border: 1px solid #d4d4d8" shape="circle"
              :image="headshot(data.match.p1.player?.player.id === id ? data.match.p2.player.player.id : data.match.p1.player.player.id)" />
          </template>
        </Column>
        <Column header="OPPONENT">
          <template #body="{ data }">
            <div v-if="data.match.incomplete === 'B'">BYE</div>
            <router-link v-else class="hover-link"
              :to="{ name: 'player', params: getPlayerParams(data.match.p1, data.match.p2) }">
              {{ getPlayerDetails(data.match.p1, data.match.p2, 'name') }}</router-link>
          </template>
        </Column>
        <Column header="RANK">
          <template #body="{ data }">
            <div v-if="data.match.incomplete !== 'B'">{{ getPlayerDetails(data.match.p1, data.match.p2, 'rank') }}
            </div>
          </template>
        </Column>
        <Column>
          <template #body="{ data }">
            <i :class="iconClass(data.match.winner.player.player.id, id)" />
          </template>
        </Column>
        <Column header="SCORE">
          <template #body="{ data }">
            <Tag v-if="data.match.p1?.incomplete || data.match.p2?.incomplete" class="!bg-red-500 !text-zinc-403">
              {{ data.match.p1?.incomplete || data.match.p2?.incomplete }}.
            </Tag>
            <router-link v-else-if="data.match.incomplete !== 'B'" class="hover-link"
              :to="{ name: 'match', params: { ...eventParams, mid: data.match.match_no } }">
              <WinnerScore :winner="id === data.match.p1?.player?.player.id ? data.match.p1 : data.match.p2"
                :loser="id === data.match.p1?.player?.player.id ? data.match.p2 : data.match.p1" />
            </router-link>
          </template>
        </Column>
        <Column>
          <template #body="{ data }">
            <Button v-if="data.match.incomplete !== 'B'" label="H2H" size="small" as="router-link"
              class="!border-zinc-400 !text-zinc-400 hover:!text-zinc-300 hover:!border-zinc-300" variant="outlined"
              raised rounded
              :to="{ name: 'h2h', params: { p1Name: name, p1Id: id, p2Name: encodeName(data.match.p1?.player?.player.full_name || data.match.p2?.player?.player.full_name), p2Id: data.match.p1?.player?.player.id || data.match.p2?.player?.player.id } }" />
          </template>
        </Column>
      </DataTable>
    </template>

    <template #footer>
      <div class="flex justify-between mt-1">
        <div>
          <template v-for="(value, key) in earnings" :key>
            <Tag v-if="value" :class="tagColors[key]" class="!px-3 !text-xs mx-1 !text-zinc-600" rounded>
              {{ key }}: {{ value }}
            </Tag>
          </template>
        </div>
        <div>
          <Button v-for="button in actionButtons" :key="button.title" as="router-link" :label="button.title"
            size="small" class="!border-zinc-400 !text-zinc-400 hover:!border-zinc-300 hover:!text-zinc-300 mx-2"
            variant="outlined" rounded raised :to="{ name: button.name, params: eventParams }" />
        </div>
      </div>
    </template>
  </Card>
</template>

<style scoped>
:deep(.p-datatable-thead tr th) {
  background-color: transparent !important;
  border-bottom: 0.5px solid var(--p-zinc-400) !important;
  color: var(--p-zinc-300)
}

:deep(.p-datatable-tbody tr td) {
  border-bottom: 0.5px solid var(--p-zinc-400) !important;
  color: var(--p-zinc-400)
}
</style>