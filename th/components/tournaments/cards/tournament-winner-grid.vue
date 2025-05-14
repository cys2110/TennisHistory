<script setup lang="ts">
type TournamentEventType = Pick<EventInterface, "id" | "year" | "draw_type" | "winner" | "loser"> & {
  match: Pick<MatchInterface, "sets" | "tbs" | "incomplete">
}

defineProps<{ events: TournamentEventType[]; status: APIStatusType }>()
const route = useRoute()
const name = computed(() => decodeName(route.params.name as string))
</script>

<template>
  <u-page-grid v-if="events.length || ['pending', 'idle'].includes(status)">
    <tournament-event-card
      v-if="events.length"
      v-for="event in events"
      :key="event.id"
      :id="event.id"
      :event
    />
    <event-loading-card
      v-else
      v-for="_ in 10"
      :key="_"
    />
  </u-page-grid>
  <error-message
    v-else
    :icon="ICONS.noTournament"
    :message="`No events found for ${name}`"
  />
</template>
