<script setup>
import { GET_TITLES } from '@/services/PlayerService';
import { unencodeName } from '@/utils/functions';
import { useQuery } from '@vue/apollo-composable';
import { computed, ref, watch } from 'vue';

const selectTheme = {
    activeBorderColor: "#8b5cf6",
    hoverBorderColor: "#8b5cf6",
    colorBorder: "#8b5cf6",
    colorText: "#d4d4d8",
}
const props = defineProps(['name', 'id'])
const selection = ref('titles')
const events = ref(null)

const updateDocumentTitle = () => document.title = `Titles and Finals | ${unencodeName(props.name)} | TennisHistory`
watch(() => props.name, () => {
    updateDocumentTitle()
}, { immediate: true })

const { query, variables } = GET_TITLES(props.id)
const { result, loading, error } = useQuery(query, variables)

watch(result, (newResult) => {
    if (newResult) events.value = newResult.players[0]
    if (newResult) console.log(newResult.players[0])
}, { immediate: true })

watch(error, (newError) => {
    if (newError) console.error(newError)
}, { immediate: true })

const selectedArray = computed(() => {
    return selection.value === 'titles' ? events.value.titlesByYear : events.value.finalsByYear
})
</script>

<template>
    <!--[PLAYER BREADCRUMB]-->
    <Title>
        <template #title>{{ unencodeName(name) }}</template>
        <template #subtitle>Titles and Finals</template>
    </Title>
    <div v-if="events">
        <a-config-provider :theme="{ components: { Select: selectTheme } }">
            <a-select v-model:value="selection">
                <a-select-option value="titles">Titles</a-select-option>
                <a-select-option value="finals">Finals</a-select-option>
            </a-select>
            <FinalsTable :events="selectedArray" />
        </a-config-provider>
    </div>
    <Loading v-else :loading>
        <template #none>No titles or finals played</template>
    </Loading>
</template>