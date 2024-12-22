<script setup lang="ts">
import type { EventCard } from '@/utils/types'

const { longDates } = useDates()
const { getCategorySrc } = useImages()

// Variables
const props = defineProps<{ event: EventCard }>()
const { start_date, tournament, year, id, venue, sponsor_name, category, surface, end_date } = props.event

// Buttons
const isDisabled = DateTime.now() < DateTime.fromISO(start_date)
const tooltipText = "Event has not started yet"

// Router link params
const tournamentParams = { name: useChangeCase(tournament.name, 'snakeCase').value, id: tournament.id }
const eventParams = { ...tournamentParams, year: year.id, eid: id }
</script>

<template>
  <card class="full-card">
    <template #title>
      <div class="flex items-center gap-3">
        <div class="rounded-full bg-violet-800 w-10 h-10 flex justify-center items-center">
          <Avatar v-if="category" :image="getCategorySrc(category)" size="large" />
        </div>
        <div class="hover-link">
          <router-link class="font-bold text-base" :to="{ name: 'tournament', params: tournamentParams }">
            {{ tournament.name }}
          </router-link>
        </div>
      </div>
    </template>
    <template #subtitle>
      <div v-if="sponsor_name" class="text-sm mt-2">{{ sponsor_name }}</div>
    </template>
    <template #content>
      <div class="flex flex-col gap-1 justify-end">
        <Divider />
        <div v-if="venue" class="flex items-center justify-center md:justify-start gap-2">
          <span>{{ venue.city }}</span>
          <GetFlag :country="venue.country.id" />
        </div>
        <div class="text-center md:text-left">{{ longDates(start_date, end_date) }}</div>
        <div v-if="surface" class="text-center md:text-left">{{ SURFACES[surface.id] }}
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-between md:justify-evenly mt-5">
        <Button v-if="isDisabled" v-for="page in EVENT_PAGES" :key="page.name" :label="page.title" size="small"
          variant="outlined" rounded raised v-tooltip="tooltipText" disabled />
        <Button v-else v-for="(page, index) in EVENT_PAGES" :key="index" as="router-link" :label="page.title"
          size="small" variant="outlined" rounded raised :to="{ name: page.name, params: eventParams }" />
      </div>
    </template>
  </card>
</template>