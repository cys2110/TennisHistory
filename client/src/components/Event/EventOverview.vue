<script setup lang="tsx">
import { formattedDates } from '@/utils/functions';
import type { Event } from '@/utils/types'
import { CURRENCIES, SURFACES } from '@/utils/variables'
import GetFlag from '../Global/GetFlag.vue';

const props = defineProps<{
  event: Pick<Event, 'currency' | 'pm' | 'tfc' | 'sponsor_name' | 'category' | 'start_date' | 'end_date' | 'surface' | 'venue' | 'supervisors' | 'draw_type'>
}>()
const { currency, pm, tfc, sponsor_name, category, start_date, end_date, surface, venue, supervisors, draw_type } = props.event

const descriptionItems = [
  { label: 'Sponsor name', value: () => sponsor_name ?? '—' },
  { label: 'Category', value: () => category ?? '—' },
  { label: 'Dates', value: () => formattedDates(start_date, end_date) },
  { label: 'Surface', value: () => SURFACES[surface.id] ?? '—' },
  {
    label: 'Venue', value: () => <div class="flex flex-col xl:flex-row xl:items-center">
      <span>{venue?.name ? `${venue.name},` : '—'}&nbsp;</span>
      {venue && <span class="flex items-center mr-2">{venue.city} <GetFlag country={venue.country.id} />
      </span>}
    </div>
  },
  { label: 'Draw type', value: () => draw_type },
  {
    label: supervisors.length === 1 ? 'Supervisor' : 'Supervisors', value: () => supervisors.length > 0 ? supervisors.map(supervisor => supervisor.id) : '—'
  },
  { label: 'Prize money', value: () => currency && pm ? `${CURRENCIES[currency]} ${pm.toLocaleString('en-GB')}` : '—' },
  { label: 'Total financial commitment', value: () => currency && tfc ? `${CURRENCIES[currency]} ${tfc.toLocaleString('en-GB')}` : '—' },
]
</script>

<template>
  <div id="details" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5 mt-5">
    <Fieldset v-for="item in descriptionItems" :key="item.label" :legend="item.label">
      <component :is="item.value" />
    </Fieldset>
  </div>
</template>