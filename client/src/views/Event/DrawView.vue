<script setup>
import { ref, watch } from 'vue';
import { useQuery } from '@vue/apollo-composable';
import { GET_DRAW } from '@/services/EventService';
import { encodeName, unencodeName, updateDocumentTitle } from '@/utils/functions';

// [FUTURE: FILTER BY PLAYER]
// [FUTURE: PDF OF DRAW]

const props = defineProps(['name', 'id', 'year', 'eid'])
const matches = ref(null)
const anchorItems = ref(null)
const selectedRound = ref(null)

// Update document title
watch(() => props.name, () => updateDocumentTitle(`Draw | ${unencodeName(props.name)} ${props.year} | TennisHistory`), { immediate: true })

// API call
const { query, variables } = GET_DRAW(parseInt(props.eid))
const { result, loading, error } = useQuery(query, variables)

watch(result, (newResult) => {
    if (newResult) {
        matches.value = newResult.events[0].rounds
        anchorItems.value = matches.value.map(round => ({ number: round.number, round: round.round }))
        selectedRound.value = anchorItems.value[0].number
    }
})
watch(error, (newError) => {
    if (newError) console.error(newError)
})

const handleChange = (e) => selectedRound.value = e
</script>

<template>
    <a-row>
        <a-col :span="4">
            <div class="flex flex-col" v-if="matches">
                <a-checkable-tag v-for="item in anchorItems" :key="item.number" :checked="selectedRound === item.number"
                    :value="item.number" class="my-2" @change="handleChange(item.number)">
                    {{ item.round }}</a-checkable-tag>
            </div>
        </a-col>
        <a-col :span="20">
            <a-row v-if="matches" class="flex overflow-x-auto scroll-smooth" id="draw-container">
                <template v-for="round in matches" :key="round.round">
                    <a-col :span="7" v-if="selectedRound > round.number - 1 && selectedRound < round.number + 3"
                        class="flex-[0_0_auto] w-1/3 mx-4 flex flex-col justify-around items-center mb-2 font-bold">
                        {{ round.round }}
                    </a-col>
                </template>
            </a-row>
            <a-row v-if="matches" class="flex overflow-x-auto scroll-smooth" id="draw-container">
                <template v-for="round in matches" :key="round.round">
                    <a-col :span="7" v-if="selectedRound > round.number - 1 && selectedRound < round.number + 3"
                        class="flex-[0_0_auto] w-1/3 mx-4 flex flex-col justify-around" :id="encodeName(round.round)">
                        <DrawCard v-for="match in round.matches" :key="match.match_no" :match :name :id :eid :year />
                    </a-col>
                </template>
            </a-row>
        </a-col>
    </a-row>
    <Loading v-if="!matches" :loading>
        <template #none>No draw available</template>
    </Loading>
</template>