<script setup lang="ts">
const { match_no } = defineProps<{
  tour: TourType
  type: MatchType
  sets: number[][][]
  tournament: Pick<TournamentInterface, "name" | "id">
  id: number
  year: number
  match_no: number
  incomplete?: IncompleteType | null
  centred?: boolean
  stats: boolean
}>()
</script>

<template>
  <div
    class="flex items-center gap-1"
    :class="{ 'justify-center': centred }"
  >
    <u-link
      v-if="stats"
      class="hover-link default-link"
      :to="{
        name: 'match',
        params: {
          name: kebabCase(tournament.name),
          id: tournament.id,
          year,
          eid: id,
          mid: constructMid(match_no, tour, type, 'Main')
        }
      }"
    >
      <span
        v-for="(set, index) in sets[0]"
        :key="index"
      >
        <!--@vue-ignore-->
        {{ set[0] }}{{ sets[1][index][0]
        }}<sup v-if="set[1] && sets[1]?.[index]?.[1]">{{ set[1] > sets[1][index][1] ? sets[1][index][1] : set[1] }}</sup>
      </span>
    </u-link>
    <span
      v-else
      v-for="(set, index) in sets[0]"
      :key="index"
    >
      <!--@vue-ignore-->
      {{ set[0] }}{{ sets[1][index][0]
      }}<sup v-if="set?.[1] && sets[1]?.[index]?.[1]">{{ set[1] > sets[1][index][1] ? sets[1][index][1] : set[1] }}</sup>
    </span>
    <u-badge
      v-if="incomplete"
      size="sm"
      color="error"
      variant="subtle"
    >
      {{ incomplete }}.
    </u-badge>
  </div>
</template>
