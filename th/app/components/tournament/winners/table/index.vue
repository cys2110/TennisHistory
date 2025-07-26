<script setup lang="ts">
import { TournamentWinnersTableGrouped, TournamentWinnersTableUngrouped } from "#components"

const { events } = defineProps<{
  events: TournamentWinnerEventType[]
  status: APIStatusType
}>()
const { tableMode } = useDefaultTable()

const flattenedEvents = computed(() => {
  const newEvents: TournamentWinnerFlattenedType[] = []
  events.forEach(event => {
    if (event.country) {
      const score = event.country.score.split("-").map((s: string) => Number(s))
      newEvents.push({
        ...event,
        type: "Country",
        winner: score[0]! > score[1]! ? event.country.c1 : event.country.c2,
        loser: score[0]! > score[1]! ? event.country.c2 : event.country.c1,
        score: event.country.score
      })
    } else {
      if (event.singles) {
        event.singles.forEach(singles => {
          if (typeof singles.winner !== "string") {
            newEvents.push({
              id: event.id,
              year: event.year,
              tour: singles.tour,
              labels: singles.labels,
              sets: singles.sets,
              incomplete: singles.incomplete,
              stats: singles.stats,
              type: "Singles",
              winner: [singles.winner as PlayerInterface],
              loser: [singles.loser as PlayerInterface]
            })
          }
        })
      }

      if (event.doubles) {
        event.doubles.forEach(doubles => {
          if (doubles.loser) {
            newEvents.push({
              id: event.id,
              year: event.year,
              tour: doubles.tour,
              labels: doubles.labels,
              sets: doubles.sets,
              incomplete: doubles.incomplete,
              stats: doubles.stats,
              type: "Doubles",
              winner: doubles.winner as PlayerInterface[],
              loser: doubles.loser as PlayerInterface[]
            })
          }
        })
      }
    }
  })
  return newEvents
})
</script>

<template>
  <component
    :is="tableMode === 'grouped' ? TournamentWinnersTableGrouped : TournamentWinnersTableUngrouped"
    :key="tableMode"
    :events="flattenedEvents"
    :status
  />
</template>
