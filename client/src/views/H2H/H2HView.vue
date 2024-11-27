<script setup>
import { ref, watch } from 'vue';
import apolloClient from '@/apollo';
import { provideApolloClient, useQuery } from '@vue/apollo-composable';
import { GET_H2H } from '@/services/MiscService';
import { headshot, unencodeName } from '@/utils/functions';

// [TODO: ADD BASE H2H PAGE AND SEARCH FUNCTION]
const props = defineProps(['p1Name', 'p1Id', 'p2Name', 'p2Id'])
const h2h = ref(null)
const pieStats = ref(null)

// Update document title
const updateDocumentTitle = () => document.title = `${unencodeName(props.p1Name)} v. ${unencodeName(props.p2Name)} | TennisHistory`
watch(() => [props.p1Name, props.p2Name], () => updateDocumentTitle(), { immediate: true })

// API call
provideApolloClient(apolloClient)
const { query, variables } = GET_H2H(props.p1Id, props.p2Id)
const { result, loading, error } = useQuery(query, variables)

watch(result, (newResult) => {
    if (newResult) {
        h2h.value = newResult
        pieStats.value = [{
            name: unencodeName(props.p1Name),
            value: h2h.value.p1Wins.count,
            itemStyle: { color: '#6d28d9' }
        },
        {
            name: unencodeName(props.p2Name),
            value: h2h.value.p2Wins.count,
            itemStyle: { color: '#166534' }
        }]
    }
})

watch(error, (newError) => {
    if (newError) console.error(newError)
})
</script>

<template>
    <Title>
        <template #title>{{ unencodeName(p1Name) }} v. {{ unencodeName(p2Name) }}</template>
    </Title>
    <a-row v-if="h2h" :gutter="32">
        <a-col :span="6">
            <a-image class="border-2 border-zinc-400 mx-auto rounded-full" :src="headshot(h2h.p1[0].id)"
                :alt="h2h.p1[0].full_name" :preview="false" />
            <PlayerTable :player="h2h.p1[0]" :number="1" />
        </a-col>
        <a-col :span="12">
            <H2HPieChart :stats="pieStats" />
            <H2HTable :p1="h2h.p1[0]" :p2="h2h.p2[0]" />
        </a-col>
        <a-col :span="6">
            <a-image class="border-2 border-zinc-400 mx-auto rounded-full" :src="headshot(h2h.p2[0].id)"
                :alt="h2h.p2[0].full_name" :preview="false" />
            <PlayerTable :player="h2h.p2[0]" :number="2" />
        </a-col>
    </a-row>
    <MatchTable v-if="h2h" :matches="h2h.matches" />
    <Loading v-if="!h2h" :loading>
        <template #none>No matches played against each other</template>
    </Loading>
</template>