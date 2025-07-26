<script setup lang="ts">
import { UPageGrid, UPageList } from "#components"

defineProps<{
  events: TournamentWinnerEventType[]
  status: APIStatusType
}>()
const { icons } = useAppConfig()
const tours = inject<TourType[]>("tours", [])
const name = inject<string>("tournamentName", "")
const { params } = useRoute()
const { id } = params as { id: string }
</script>

<template>
  <component
    :is="tours.length === 1 || COUNTRY_DRAWS.includes(id) ? UPageGrid : UPageList"
    v-if="events.length || status === 'pending'"
    :class="{ 'gap-5 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2': tours.length === 1 }"
  >
    <tournament-winners-card
      v-if="events.length"
      v-for="event in events"
      :key="event.id"
      :event
    />
    <loading-event
      v-else
      v-for="_ in 10"
      :key="_"
    />
  </component>
  <error-message
    v-else
    :icon="icons.noTournament"
    :message="`No events found for ${name}`"
  />
</template>
