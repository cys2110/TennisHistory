<script setup lang="ts">
type ResultsType = {
  title: RoundType
  matches: Pick<MatchInterface, "match_no" | "date" | "court" | "duration" | "incomplete" | "umpire" | "winner" | "loser">[]
}

defineProps<{ rounds: ResultsType[]; status: APIStatusType }>()
const route = useRoute()
const name = computed(() => decodeName(route.params.name as string))
</script>

<template>
  <u-stepper
    v-if="rounds.length"
    :items="rounds"
    :linear="false"
    color="secondary"
  >
    <template #indicator="{ item }">
      {{ SHORT_ROUNDS[item.title] }}
    </template>
    <template #content="{ item }">
      <u-page-grid class="py-10 xl:!grid-cols-3">
        <result-card
          v-for="match in item.matches"
          :key="match.match_no"
          :match="match"
        />
      </u-page-grid>
    </template>
  </u-stepper>
  <error-message
    v-else
    :message="`No results found for ${name} ${route.params.year}`"
  />
</template>
