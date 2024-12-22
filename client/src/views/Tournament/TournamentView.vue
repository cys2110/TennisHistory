<script setup lang="ts">
import { GET_TOURNAMENT } from '@/services/TournamentService'
const route = useRoute()

// Variables
const id = useRouteParams('id').value
const name = useRouteParams('name').value
const title = useTitle(`${useChangeCase(name as string, 'capitalCase').value} | TennisHistory`)
const tournament: Ref<Tournament | null> = ref(null)

// Check if single year tournament or active tournament
const years = computed(() => {
  if (tournament.value?.end_year) {
    if (tournament.value?.start_year.id === tournament.value.end_year.id) {
      return
    } else {
      return `—${tournament.value.end_year.id}`
    }
  } else {
    return ' - present'
  }
})

// API call
const { query, variables } = GET_TOURNAMENT(useToNumber(id as string).value)
const { result, loading, error } = useQuery(query, variables)

watch(result, (newResult) => {
  if (newResult) tournament.value = newResult.tournaments[0]
}, { immediate: true })

watch(error, (newError) => {
  if (newError) console.error(newError)
}, { immediate: true })
</script>

<template>
  <div v-if="route.name === 'tournament'">
    <Title>
      <template #title>{{ useChangeCase(name as string, 'capitalCase') }}</template>
      <template v-if="tournament" #subtitle>{{ tournament.start_year.id }}{{ years }}</template>
    </Title>
    <div v-if="tournament && tournament.events.length > 0"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8 mt-5">
      <TournamentCard v-for="event in tournament.events" :key="event.id" :event :id="useToNumber(id as string)" :name />
    </div>
    <div v-else-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8 mt-5">
      <TournamentLoadingCard v-for="i in new Array(4)" :key="i" />
    </div>
    <ErrorMessage v-else message="No events played.">
      <template #icon>
        <i class="fa-duotone fa-solid fa-triangle-exclamation"></i>
      </template>
    </ErrorMessage>
  </div>
  <router-view />
</template>