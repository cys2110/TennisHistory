<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Ref } from 'vue'
import { useRoute } from 'vue-router'
import { useQuery } from '@vue/apollo-composable'
import { GET_TOURNAMENT } from '@/services/TournamentService'
import { unencodeName, updateDocumentTitle } from '@/utils/functions'
import type { Tournament } from '@/utils/types'

// Variables/interfaces
const route = useRoute()
const { id, name } = route.params
const tournament: Ref<Tournament | null> = ref(null)

// Update document title
watch(() => name, () => updateDocumentTitle(`${unencodeName(name as string)} | TennisHistory`), { immediate: true })

// API call
const { query, variables } = GET_TOURNAMENT(parseInt(id as string))
const { result, loading, error } = useQuery(query, variables)

watch(result, (newResult) => {
  if (newResult) tournament.value = newResult.tournaments[0]
}, { immediate: true })

watch(error, (newError) => {
  if (newError) console.error(newError)
}, { immediate: true })

const years = computed(() => {
  return tournament.value?.start_year === tournament.value?.end_year ? tournament.value?.start_year.id : `${tournament.value?.start_year.id}—${tournament.value?.end_year?.id || 'present'}`
})
</script>

<template>
  <div v-if="route.name === 'tournament'">
    <Title>
      <template #title>{{ unencodeName(name as string) }}</template>
      <template v-if="tournament" #subtitle>{{ years }}</template>
    </Title>
    <div v-if="tournament && tournament.events.length > 0"
      class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10 w-3/4 mx-auto">
      <TournamentCard v-for="event in tournament.events" :key="event.id" :event :id="parseInt(id as string)" :name />
    </div>
    <Loading v-else :loading>
      <template #none>No events played</template>
    </Loading>
  </div>
  <router-view />
</template>