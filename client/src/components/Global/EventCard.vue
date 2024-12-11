<script setup lang="ts">
import { DateTime } from 'luxon'
import { categorySrc, encodeName, formattedDates } from '@/utils/functions'
import { SURFACES } from '@/utils/variables'
import type { EventCard } from '@/utils/types'
import GetFlag from './GetFlag.vue'

// Variables
const props = defineProps<{
  event: EventCard
}>()
const { start_date, tournament, year, id, venue, sponsor_name, category, surface, end_date } = props.event

// Button pages
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
  <Card class="full-card">

    <template #title>
      <router-link class="hover-link font-bold text-wrap" :to="{ name: 'tournament', params: tournamentParams }">
        {{ tournament.name }}
      </router-link>
      <Divider align="center">
        <div v-if="sponsor_name" class="text-sm text-zinc-400 text-center">{{ sponsor_name }}</div>
      </Divider>
    </template>

    <template #content>
      <div class="grid grid-cols-4">
        <div v-if="venue" class="flex items-center col-span-3">
          {{ venue.city }}
          <GetFlag :country="venue.country.id" />
        </div>
        <div class="row-span-3">
          <Image v-if="category" :src="categorySrc(category)" :alt="category" />
        </div>
        <div class="col-span-3">{{ formattedDates(start_date, end_date) }}</div>
        <div v-if="surface" class="col-span-3">{{ SURFACES[surface.id] }}</div>
      </div>
    </template>

    <template #footer>
      <Divider />
      <div class="flex justify-evenly">
        <Button v-if="isDisabled" v-for="page in eventPages" :key="page.name" :label="page.title" size="small"
          class="!border-zinc-400 !text-zinc-400 !cursor-not-allowed" variant="outlined" rounded raised
          v-tooltip="tooltipText" disabled />
        <Button v-else v-for="(page, index) in eventPages" :key="index" as="router-link" :label="page.title"
          size="small" class="!border-zinc-400 !text-zinc-400 hover:!border-zinc-300 hover:!text-zinc-300"
          variant="outlined" rounded raised :to="{ name: page.name, params: eventParams }" />
      </div>
    </template>

  </Card>
</template>

<style scoped>
:deep(.p-card-content) {
  @apply !h-full !flex !items-center !justify-center
}
</style>