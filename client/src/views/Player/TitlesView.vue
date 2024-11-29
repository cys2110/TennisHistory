<script setup>
import { computed, ref, watch } from 'vue';
import { useQuery } from '@vue/apollo-composable';
import { GET_TITLES } from '@/services/PlayerService';
import { unencodeName, updateDocumentTitle } from '@/utils/functions';

// Variables
const props = defineProps(['name', 'id'])
const selection = ref('titles')
const events = ref(null)
const dropdownSelection = [{ label: 'Titles', value: 'titles' }, { label: 'Finals', value: 'finals' }]

// Update document title
watch(() => props.name, () => updateDocumentTitle(`Titles and Finals | ${unencodeName(props.name)} | TennisHistory`), { immediate: true })

// API call
const { query, variables } = GET_TITLES(props.id)
const { result, loading, error } = useQuery(query, variables)

watch(result, (newResult) => {
    if (newResult) events.value = newResult.playerTitlesAndFinals
}, { immediate: true })

watch(error, (newError) => {
    if (newError) console.error(newError)
}, { immediate: true })

const selectedArray = computed(() => {
    return selection.value === 'titles' ? events.value.titles : events.value.finals
})
</script>

<template>
    <div v-if="events">
        <a-select v-model:value="selection" class="mb-5">
            <a-select-option v-for="select in dropdownSelection" :key="select.label" :value="select.value">{{
                select.label }}</a-select-option>
        </a-select>
        <FinalsTable :events="selectedArray" />
    </div>
    <Loading v-else :loading>
        <template #none>No titles or finals played</template>
    </Loading>
</template>