<script setup lang="ts">
defineProps<{
  labels: string[]
  sets: number[][][]
  tournament: TournamentInterface
  id: number
  year: string
  match_no: number
  incomplete?: IncompleteType | null
  centred?: boolean
  stats?: boolean
}>()
</script>

<template>
  <div
    class="flex items-center gap-1"
    :class="{ 'justify-center': centred }"
  >
    <u-link
      v-if="stats"
      class="hover-link"
      :to="{
        name: 'match',
        params: {
          name: kebabCase(tournament.name),
          id: tournament.id,
          year,
          eid: id,
          mid: constructMid(match_no, labels)
        }
      }"
    >
      <span
        v-if="sets[0] && sets[1]"
        v-for="(set, index) in sets[0]?.length"
        :key="index"
      >
        <!--@vue-ignore-->
        {{ sets[0][index][0] }}{{ sets[1][index][0]
        }}<sup v-if="sets[0]?.[index]?.[1] && sets[1]?.[index]?.[1]">{{
          sets[0][index][1] > sets[1][index][1] ? sets[1][index][1] : sets[0][index][1]
        }}</sup>
      </span>
    </u-link>
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
