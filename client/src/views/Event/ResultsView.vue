<script setup>
import { ref, watch } from 'vue';
import apolloClient from '@/apollo';
import { GET_RESULTS } from '@/services/EventService';
import { unencodeName } from '@/utils/functions';
import { provideApolloClient, useQuery } from '@vue/apollo-composable';

// [FUTURE: FILTER BY DATE, COURT, UMPIRE, PLAYER]

const props = defineProps(['name', 'id', 'year', 'eid'])
const matches = ref(null)
const anchorItems = ref(null)

// Update document title
const updateDocumentTitle = () => document.title = `Results | ${unencodeName(props.name)} ${props.year} | TennisHistory`
watch(() => props.name, () => updateDocumentTitle(), { immediate: true })

// API CALL
provideApolloClient(apolloClient)
const { query, variables } = GET_RESULTS(parseInt(props.eid))
const { result, loading, error } = useQuery(query, variables)

watch(result, (newResult) => {
    if (newResult) {
        matches.value = newResult.events[0].rounds
        anchorItems.value = matches.value.map(round => (
            {
                key: round.number,
                href: `#${round.round}`,
                title: round.round
            }
        ))
    }
})

watch(error, (newError) => {
    if (newError) console.error(newError)
})
</script>

<template>
    <!--[TODO: EVENT BREADCRUMBS]-->
    <Title>
        <template #title>{{ unencodeName(name) }} {{ year }}</template>
        <template #subtitle>Results</template>
    </Title>
    <a-row v-if="matches">
        <a-col :span="4">
            <a-config-provider :theme="{ components: { Anchor: { colorPrimary: '#6d28d9' } } }">
                <a-anchor :offset-top="75" :items="anchorItems" />
            </a-config-provider>
        </a-col>
        <a-col :span="20">
            <div v-for="round in matches" :key="round.number" :id="round.round">
                <div class="text-4xl my-5">{{ round.round }}</div>
                <a-row justify="space-evenly" :gutter="[0, 32]">
                    <a-col :span="11" v-for="match in round.matches" :key="match.match_no">
                        <ResultCard :match :name :id :year :eid />
                    </a-col>
                </a-row>
            </div>
        </a-col>
    </a-row>
    <Loading v-else :loading>
        <template #none>No results available</template>
    </Loading>
</template>