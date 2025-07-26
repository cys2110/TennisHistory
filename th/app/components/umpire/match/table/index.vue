<script setup lang="ts">
const { events: rawEvents } = defineProps<{
  events: UmpireAPIType[]
  status: APIStatusType
  firstName: string
  lastName: string
}>()
const { tableMode } = useDefaultTable()

const events = computed(() => {
  return rawEvents.flatMap(event =>
    event.rounds.flatMap(round =>
      round.matches.flatMap(match => ({
        id: event.id,
        tournament: event.tournament,
        year: event.year,
        tours: event.tours,
        round: round.round,
        match_no: match.match_no,
        p1: match.p1,
        p2: match.p2,
        labels: match.labels,
        stats: match.stats
      }))
    )
  )
})
</script>

<template>
  <umpire-match-table-grouped
    v-if="tableMode === 'grouped'"
    :events
    :status
    :first-name="firstName"
    :last-name="lastName"
  />
  <umpire-match-table-ungrouped
    v-else
    :events
    :status
    :first-name="firstName"
    :last-name="lastName"
  />
</template>
