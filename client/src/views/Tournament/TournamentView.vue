<script setup>
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useQuery } from '@vue/apollo-composable';
import { GET_TOURNAMENT } from '@/services/TournamentService';
import { unencodeName, updateDocumentTitle } from '@/utils/functions';

// Variables
const route = useRoute()
const { id, name } = route.params
const tournament = ref(null)

// Update document title
watch(() => name, () => updateDocumentTitle(`${unencodeName(name)} | TennisHistory`), { immediate: true })

// API call
const { query, variables } = GET_TOURNAMENT(parseInt(id))
const { result, loading, error } = useQuery(query, variables)

watch(result, (newResult) => {
    if (newResult) tournament.value = newResult.tournaments[0]
}, { immediate: true })

watch(error, (newError) => {
    if (newError) console.error(newError)
}, { immediate: true })

const years = computed(() => {
    return !tournament.value.end_year ? `${tournament.value.start_year.id}—present` : tournament.value.start_year === tournament.value.end_year ? tournament.value.start_year.id : `${tournament.value.start_year.id}—${tournament.value.end_year.id}`
})
</script>

<template>
    <div v-if="route.name === 'tournament'">
        <Title>
            <template #title>{{ unencodeName(name) }}</template>
            <template v-if="tournament" #subtitle>{{ years }}</template>
        </Title>
        <a-row v-if="tournament?.events.length > 0" justify="space-evenly" :gutter="[0, 32]">
            <a-col v-for="event in tournament.events" :key="event.id" :xs="24" :md="11" :lg="7" :xl="5">
                <TournamentCard :event :id :name />
            </a-col>
        </a-row>
        <Loading v-else :loading>
            <template #none>No events played</template>
        </Loading>
    </div>
    <router-view />
</template>