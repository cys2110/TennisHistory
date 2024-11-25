<script setup>
import { ref, watch } from 'vue';
import apolloClient from '@/apollo';
import { provideApolloClient, useQuery } from '@vue/apollo-composable';
import { GET_PLAYER } from '@/services/PlayerService';
import { gladiator, headshot, unencodeName } from '@/utils/functions';

const props = defineProps(['name', 'id'])
const player = ref(null)

const updateDocumentTitle = () => document.title = `${unencodeName(props.name)} | TennisHistory`
watch(() => props.name, () => {
    updateDocumentTitle()
}, { immediate: true })

provideApolloClient(apolloClient)
const { query, variables } = GET_PLAYER(props.id)
const { result, loading, error } = useQuery(query, variables)

watch(result, (newResult) => {
    if (newResult) player.value = newResult.players[0]
    if (newResult) console.log(player.value)
})
watch(error, (newError) => {
    if (newError) console.error(newError)
})
</script>

<template>
    <!--[ADD PLAYER BREADCRUMBS]-->
    <Title>
        <template #title>{{ unencodeName(name) }}</template>
        <template #subtitle>Player Overview</template>
    </Title>
    <a-row v-if="player">
        <a-col :span=4>
            <a-image :alt="player.full_name" :src="player.gladiator ? gladiator(player.id) : headshot(player.id)"
                :preview="false" />
        </a-col>
        <a-col :span=20>
            <PlayerDetails :player />
            <!--[INSERT MAJOR RESULTS TABLE]-->
        </a-col>
    </a-row>
    <Loading v-else :loading>
        <template #none>No data available</template>
    </Loading>
</template>