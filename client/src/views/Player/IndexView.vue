<script setup>
import { ref, watch } from 'vue';
import apolloClient from '@/apollo';
import { provideApolloClient, useQuery } from '@vue/apollo-composable';
import { unencodeName } from '@/utils/functions';
import { GET_INDEX } from '@/services/PlayerService';

const props = defineProps(['name', 'id'])
const player = ref(null)

const updateDocumentTitle = () => document.title = `WL Index | ${unencodeName(props.name)} | TennisHistory`
watch(() => props.name, () => {
    updateDocumentTitle()
}, { immediate: true })

provideApolloClient(apolloClient)
const { query, variables } = GET_INDEX(props.id)
const { result, loading, error } = useQuery(query, variables)

watch(result, (newResult) => {
    if (newResult) player.value = newResult.players[0].index
})

watch(error, (newError) => {
    if (newError) console.error(newError)
})
</script>

<template>
    <Title>
        <template #title>{{ unencodeName(name) }}</template>
        <template #subtitle>Win-Loss Index</template>
    </Title>
    <IndexChart v-if="player" :player />
    <Loading v-else :loading>
        <template #none>No data available</template>
    </Loading>
</template>