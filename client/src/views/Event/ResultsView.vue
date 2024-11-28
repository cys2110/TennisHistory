<script setup>
import { ref, watch } from 'vue';
import { useQuery } from '@vue/apollo-composable';
import { GET_RESULTS } from '@/services/EventService';
import { unencodeName, updateDocumentTitle } from '@/utils/functions';

// [FUTURE: FILTER BY DATE, COURT, UMPIRE, PLAYER]

const props = defineProps(['name', 'id', 'year', 'eid'])
const matches = ref(null)
const anchorItems = ref(null)

// Update document title
watch(() => props.name, () => updateDocumentTitle(`Results | ${unencodeName(props.name)} ${props.year} | TennisHistory`), { immediate: true })

// API CALL
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
    <a-row v-if="matches">
        <a-col :span="4">
            <a-anchor :offset-top="75" :items="anchorItems" />
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