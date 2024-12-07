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
const { start_date, tournament, year, id, venue, sponsor_name, category, surface, end_date } =
  props.event

// Button pages
const eventPages = [
  { title: 'Details', name: 'event' },
  { title: 'Results', name: 'results' },
  { title: 'Draw', name: 'draw' },
]
const isDisabled = DateTime.now() < DateTime.fromISO(start_date)

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
  <a-card class="full-card">

    <template #title>
      <router-link class="hover-link font-bold text-wrap" :to="{ name: 'tournament', params: tournamentParams }">
        {{ tournament.name }}
      </router-link>
    </template>

    <template #extra>
      <div class="flex items-center">
        <a-image v-if="category" class="!w-[50px]" :alt="category" :src="categorySrc(category)" :preview="false" />
      </div>
    </template>

    <template #actions>
      <a-button v-for="page in eventPages" :key="page.name" type="dashed" :ghost="true" shape="round" size="small"
        :disabled="isDisabled" class="!border-zinc-300 hover:!border-zinc-400">
        <template v-if="isDisabled">
          <a-tooltip title="Event has not started yet">{{ page.title }}</a-tooltip>
        </template>
        <template v-else>
          <router-link class="!text-zinc-300 hover:!text-zinc-400" :to="{ name: page.name, params: eventParams }">
            {{ page.title }}
          </router-link>
        </template>
      </a-button>
    </template>

    <a-card-meta>
      <template #title v-if="sponsor_name">
        <div class="text-wrap text-sm">{{ sponsor_name }}</div>
      </template>

      <template #description>
        <div v-if="venue" class="flex items-center">
          {{ venue.city }}
          <Icon v-if="selectedFlag" class="mx-2 text-2xl" :component="selectedFlag" />
        </div>
        <div>{{ formattedDates(start_date, end_date) }}</div>
        <div v-if="surface">{{ SURFACES[surface.id] }}</div>
      </template>
    </a-card-meta>

  </a-card>
</template>