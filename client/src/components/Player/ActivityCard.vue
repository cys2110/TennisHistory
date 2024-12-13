<script setup lang="ts">
import { $dt } from '@primevue/themes';
import type { Entry } from '@/utils/types';
import { useConversion } from '@/utils/useConversion';
import { useUrlNames } from '@/utils/useUrlNames';
import { EVENT_PAGES, SURFACES } from '@/utils/variables'

const { encodeName } = useUrlNames()
const { formatCurrency, formattedDates } = useConversion()

const props = defineProps<{
  id: string
  name: string
  event: Entry
}>()

const eventDetails = props.event.scores[0].match.round.event
const { seed, status, points, rank, pm, scores } = props.event

const earnings = {
  Seed: seed,
  Status: status,
  Points: points,
  Rank: rank,
  'Prize Money': eventDetails.currency ? formatCurrency(eventDetails.currency, pm) : null,
}

const tagColors = {
  Seed: $dt('orange.500').value,
  Status: $dt('fuchsia.500').value,
  Points: $dt('teal.500').value,
  Rank: $dt('blue.500').value,
  'Prize Money': $dt('emerald.500').value,
}

const tournamentParams = {
  name: encodeName(eventDetails.tournament.name),
  id: eventDetails.tournament.id,
}
const eventParams = {
  ...tournamentParams,
  year: eventDetails.year.id,
  eid: eventDetails.id,
}
</script>

<template>
  <Panel>
    <template #header>
      <div class="flex flex-col w-full">
        <div class="flex flex-col lg:flex-row justify-between">
          <div class="flex flex-col">
            <div class="flex flex-col lg:flex-row lg:items-center">
              <span v-if="eventDetails.sponsor_name" class="text-xs lg:text-base">{{ eventDetails.sponsor_name }} |
                &nbsp;</span>
              <span>
                <router-link class="hover-link font-bold text-sm md:text-xl"
                  :to="{ name: 'tournament', params: tournamentParams }">{{
                    eventDetails.tournament.name }}</router-link>
              </span>
            </div>
            <div class="text-xs lg:text-base">
              {{ formattedDates(eventDetails.start_date, eventDetails.end_date) }} |
              {{ eventDetails.venue.city }}
              <GetFlag :country="eventDetails.venue.country.id" />
            </div>
          </div>
          <div class="flex flex-col items-start lg:items-end lg:justify-center text-xs lg:text-base">
            <div>{{ eventDetails.category }}</div>
            <div>{{ SURFACES[eventDetails.surface.id] }}</div>
          </div>
        </div>
        <Divider />
      </div>
    </template>

    <ActivityTable :scores :id :name :eventParams />

    <template #footer>
      <div class="flex flex-col gap-3 justify-between mt-1">
        <div class="flex flex-col lg:flex-row lg:justify-center gap-1 text-center">
          <template v-for="(value, key) in earnings" :key>
            <Tag v-if="value" class="!px-3 !text-xs mx-1" rounded
              :dt="{ primaryBackground: tagColors[key], primaryColor: '{zinc.700}' }">
              {{ key }}: {{ value }}
            </Tag>
          </template>
        </div>
        <div class="flex flex-col lg:flex-row lg:justify-center gap-1">
          <Button v-for="button in EVENT_PAGES" :key="button.title" as="router-link" :label="button.title" size="small"
            class="mx-1" variant="outlined" rounded raised :to="{ name: button.name, params: eventParams }" />
        </div>
      </div>
    </template>
  </Panel>
</template>