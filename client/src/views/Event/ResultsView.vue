<script setup>
import { ref, watch } from 'vue';
import { useQuery } from '@vue/apollo-composable';
import { Grid } from 'ant-design-vue';
import { GET_RESULTS } from '@/services/EventService';
import { unencodeName, updateDocumentTitle } from '@/utils/functions';
import { COLOURS } from '@/utils/variables';

// [FUTURE: FILTER BY DATE, COURT, UMPIRE, PLAYER]

const props = defineProps(['name', 'id', 'year', 'eid'])
const { useBreakpoint } = Grid
const screens = useBreakpoint()
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
        <a-col v-if="!screens.xs" :span="4">
            <a-anchor :offset-top="75" :items="anchorItems" />
        </a-col>
        <a-col :xs="24" :sm="20" class="pl-5">
            <a-config-provider :theme="{ components: { Anchor: { colorPrimary: COLOURS.violet400 } } }">
                <a-anchor class="smallAnchor" v-if="screens.xs" :offset-top="75" :items="anchorItems"
                    direction="horizontal" />
            </a-config-provider>
            <div v-for="round in matches" :key="round.number" :id="round.round">
                <div class="text-4xl my-5">{{ round.round }}</div>
                <a-row justify="space-evenly" :gutter="[0, 32]">
                    <a-col :xs="24" :lg="11" v-for="match in round.matches" :key="match.match_no">
                        <ResultCard v-if="match.winner?.player" :match :name :id :year :eid />
                    </a-col>
                </a-row>
            </div>
        </a-col>
    </a-row>
    <Loading v-else :loading>
        <template #none>No results available</template>
    </Loading>
</template>

<style scoped>
.smallAnchor :deep(.ant-anchor) {
    background-color: #3f3f46;
}
</style>