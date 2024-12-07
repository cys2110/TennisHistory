<script setup lang="ts">
import { onMounted, shallowRef } from 'vue'
import Icon from '@ant-design/icons-vue'
import { DateTime } from 'luxon'
import { categorySrc, encodeName, formattedDates } from '@/utils/functions'
import { SURFACES } from '@/utils/variables'
import type { EventCard } from '@/utils/types'

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

// Import flag icons on mount
const selectedFlag = shallowRef(null)
onMounted(async () => {
  const countryCode = venue.country.id
  try {
    const flags: { [key: string]: any } = await import(`@/components/icons/flags`)
    selectedFlag.value = flags[countryCode] || null
  } catch (error) {
    console.error(`Flag for ${countryCode} not found`, error)
  }
})
</script>

<template>
  <Card class="full-card">

    <template #title>
      <router-link class="hover-link font-bold text-wrap" :to="{ name: 'tournament', params: tournamentParams }">
        {{ tournament.name }}
      </router-link>
    </template>

    <template #subtitle>
      <template v-if="sponsor_name">{{ sponsor_name }}</template>
    </template>

    <template #content>
      <div class="grid grid-cols-4">
        <div v-if="venue" class="flex items-center col-span-3">
          {{ venue.city }}
          <Icon v-if="selectedFlag" class="mx-2 text-2xl" :component="selectedFlag" />
        </div>
        <div class="row-span-3">
          <Image v-if="category" :src="categorySrc(category)" :alt="category" />
        </div>
        <div class="col-span-3">{{ formattedDates(start_date, end_date) }}</div>
        <div v-if="surface" class="col-span-3">{{ SURFACES[surface.id] }}</div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-evenly">
        <Button v-for="page in eventPages" :key="page.name" as="router-link" :label="page.title" size="small"
          class="!border-zinc-400 !text-zinc-400 hover:!border-zinc-300 hover:!text-zinc-300"
          :class="{ '!cursor-not-allowed': isDisabled }" variant="outlined" rounded raised
          :to="{ name: page.name, params: eventParams }" v-tooltip="isDisabled ? tooltipText : null"
          :disabled="isDisabled" />
      </div>
    </template>

  </Card>
</template>