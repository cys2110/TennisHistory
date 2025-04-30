<script setup lang="ts">
defineProps<{
  sets: string[]
  tbs: (string | null)[]
  tournament: Pick<TournamentInterface, "id" | "name">
  id: string
  year: string
  match_no: string
  incomplete: IncompleteType | null
}>()
</script>

<template>
  <u-link
    class="hover-link"
    :to="{
      name: 'match',
      params: { name: encodeName(tournament.name), id: tournament.id, year, eid: id, mid: match_no }
    }"
  >
    <template
      v-for="(set, index) in sets"
      :key="index"
    >
      <!--prettier-ignore-->
      <span v-if="set" class="mr-1">
          {{ set }}<sup v-if="tbs[index]">{{ tbs[index] }}</sup>
        </span>
    </template>
  </u-link>
  <u-badge
    v-if="incomplete"
    size="sm"
    class="ml-2 bg-error-600"
  >
    {{ incomplete }}.
  </u-badge>
</template>
