<script setup lang="ts">
const { tour, type, match_no, round } = defineProps<{
  sets: string[]
  tbs: (string | null)[]
  tournament: Pick<TournamentInterface, "id" | "name">
  id: number
  year: string
  match_no: number
  incomplete: IncompleteType | null
  centred?: boolean
  type: "Singles" | "Doubles"
  tour: TourType
  round: string
}>()

const matchNo = computed(() => {
  const drawPrefix = round.includes("Qualifying") ? "q" : "m"
  const tourPrefix = tour === "ATP" ? "m" : "l"
  const prefix = type === "Singles" ? "s" : "d"
  const matchNumber =
    match_no < 10 ? `00${match_no}`
    : match_no < 100 ? `0${match_no}`
    : match_no
  return `${drawPrefix}${tourPrefix}${prefix}${matchNumber}`
})
</script>

<template>
  <div class="flex items-center gap-1">
    <u-link
      class="hover-link"
      :class="{ 'mx-auto': centred }"
      :to="{
        name: 'match',
        params: {
          name: encodeName(tournament.name),
          id: tournament.id,
          year,
          eid: id,
          mid: matchNo
        }
      }"
    >
      <span
        v-for="(set, index) in sets"
        :key="index"
      >
        <!--prettier-ignore-->
        <span v-if="set">
            &nbsp;{{ set }}<sup v-if="tbs[index]">{{ tbs[index] }}</sup>
          </span>
      </span>
    </u-link>
    <u-badge
      v-if="incomplete"
      size="sm"
      class="ml-2 bg-error-600"
    >
      {{ incomplete }}.
    </u-badge>
  </div>
</template>
