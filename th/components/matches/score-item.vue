<script setup lang="ts">
defineProps<{
  sets: string[]
  tbs: (string | null)[]
  tournament: Pick<TournamentInterface, "id" | "name">
  id: string
  year: string
  match_no: string
  incomplete: IncompleteType | null
  centred?: boolean
}>()
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
          mid: match_no
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
