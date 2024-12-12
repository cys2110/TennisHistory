<script setup lang="ts">
import { DateTime } from 'luxon'
import { categorySrc, encodeName, formattedDates } from '@/utils/functions'
import type { EventCard } from '@/utils/types'
import { SURFACES } from '@/utils/variables'

// Variables
const props = defineProps<{
  event: EventCard
}>()
const { start_date, tournament, year, id, venue, sponsor_name, category, surface, end_date } = props.event

// Buttons
const eventPages = [
  { title: 'Details', name: 'event' },
  { title: 'Results', name: 'results' },
  { title: 'Draw', name: 'draw' },
]
const isDisabled = DateTime.now() < DateTime.fromISO(start_date)
const tooltipText = "Event has not started yet"

// Router link params
const tournamentParams = { name: encodeName(tournament.name), id: tournament.id }
const eventParams = { ...tournamentParams, year: year.id, eid: id }
</script>

<template>
  <Panel class="md:px-5 full-card">
    <template #header>
      <div class="flex flex-col">
        <div class="flex items-center gap-3">
          <div class="rounded-full bg-violet-800 w-10 h-10 flex justify-center items-center">
            <Avatar v-if="category" :image="categorySrc(category)" size="large" />
          </div>
          <div>
            <router-link class="hover-link font-bold text-wrap" :to="{ name: 'tournament', params: tournamentParams }">
              {{ tournament.name }}
            </router-link>
          </div>
        </div>
        <div v-if="sponsor_name" class="text-sm text-zinc-400 text-center">{{ sponsor_name }}</div>
      </div>
    </template>
    <div class="flex flex-col gap-1">
      <Divider />
      <div v-if="venue" class="flex items-center justify-center md:justify-start gap-2 text-zinc-400">
        <span>{{ venue.city }}</span>
        <GetFlag :country="venue.country.id" />
      </div>
      <div class="text-zinc-400 text-center md:text-left">{{ formattedDates(start_date, end_date) }}</div>
      <div v-if="surface" class="text-zinc-400 text-center md:text-left">{{ SURFACES[surface.id] }}</div>
    </div>
    <template #footer>
      <Divider />
      <div class="flex justify-between md:justify-evenly mt-5">
        <Button v-if="isDisabled" v-for="page in eventPages" :key="page.name" :label="page.title" size="small"
          class="!border-violet-800 !text-zinc-400 !cursor-not-allowed" variant="outlined" rounded raised
          v-tooltip="tooltipText" disabled />
        <Button v-else v-for="(page, index) in eventPages" :key="index" as="router-link" :label="page.title"
          size="small" class="!text-zinc-400 hover:!text-zinc-300" variant="outlined" rounded raised
          :to="{ name: page.name, params: eventParams }" />
      </div>
    </template>
  </Panel>
</template>

<style scoped>
:deep(.p-card-content) {
  @apply !h-full !flex !items-center !justify-center
}
</style>