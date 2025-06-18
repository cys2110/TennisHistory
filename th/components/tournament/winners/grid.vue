<script setup lang="ts">
import { UPageGrid, UPageList } from "#components"

defineProps<{ events: TournamentWinnerType[]; status: APIStatusType }>()
const { icons } = useAppConfig()
const { params } = useRoute()
const name = computed(() => decodeName(params.name as string))
const tours = inject<TourType[]>("tours", []) || []
</script>

<template>
  <component
    :is="tours.length === 2 && !COUNTRY_DRAWS.includes(params.id as string) && tours.includes('ATP') ? UPageList : UPageGrid"
    v-if="events.length || ['pending', 'idle'].includes(status)"
    :class="{ 'gap-5 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2': !COUNTRY_DRAWS.includes(params.id as string) }"
  >
    <tournament-winners-card
      v-if="events.length"
      v-for="event in events"
      :key="event.id"
      :id="event.id"
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
