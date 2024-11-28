<script setup>
import { ref, watch } from 'vue';
import { useQuery } from '@vue/apollo-composable';
import { GET_H2H } from '@/services/MiscService';
import { headshot, unencodeName, updateDocumentTitle } from '@/utils/functions';
import { COLOURS } from '@/utils/variables';

// [TODO: SEARCH FUNCTION]
const props = defineProps(['p1Name', 'p1Id', 'p2Name', 'p2Id'])
const p1 = ref({ name: props.p1Name ? unencodeName(props.p1Name) : 'Jannik Sinner', id: props.p1Id || 's0ag' })
const p2 = ref({ name: props.p2Name ? unencodeName(props.p2Name) : 'Alexander Zverev', id: props.p2Id || 'z355' })
const h2h = ref(null)
const pieStats = ref(null)

// Update document title
watch(() => [props.p1, props.p2], () => updateDocumentTitle(`${p1.value.name} v. ${p2.value.name} | TennisHistory`), { immediate: true })

// API call
const { query, variables } = GET_H2H(p1.value.id, p2.value.id)
const { result, loading, error } = useQuery(query, variables)

watch(result, (newResult) => {
    if (newResult) {
        h2h.value = newResult
        console.log(h2h.value)
        pieStats.value = [{
            name: unencodeName(props.p1Name),
            value: h2h.value.p1Wins.count,
            itemStyle: { color: COLOURS.violet700 }
        },
        {
            name: unencodeName(props.p2Name),
            value: h2h.value.p2Wins.count,
            itemStyle: { color: COLOURS.green800 }
        }]
    }
})

watch(error, (newError) => {
    if (newError) console.error(newError)
})
</script>

<template>
    <Title>
        <template #title>{{ p1.name }} v. {{ p2.name }}</template>
    </Title>
    <a-row v-if="h2h" :gutter="32">
        <a-col :span="6">
            <a-image class="border-2 border-zinc-400 mx-auto rounded-full my-5" :src="headshot(h2h.p1[0].id)"
                :alt="h2h.p1[0].full_name" :preview="false" />
            <PlayerTable :player="h2h.p1[0]" :number="1" />
        </a-col>
        <a-col :span="12">
            <H2HPieChart :stats="pieStats" />
            <H2HTable :p1="h2h.p1[0]" :p2="h2h.p2[0]" />
        </a-col>
        <a-col :span="6">
            <a-image class="border-2 border-zinc-400 mx-auto rounded-full my-5" :src="headshot(h2h.p2[0].id)"
                :alt="h2h.p2[0].full_name" :preview="false" />
            <PlayerTable :player="h2h.p2[0]" :number="2" />
        </a-col>
    </a-row>
    <MatchTable v-if="h2h" :matches="h2h.matches" />
    <Loading v-if="!h2h" :loading>
        <template #none>No matches played against each other</template>
    </Loading>
</template>