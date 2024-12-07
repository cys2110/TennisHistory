<script setup lang="ts">
import { ref, watch } from 'vue';
import { useQuery } from '@vue/apollo-composable';
import { GET_INDEX } from '@/services/PlayerService';
import { unencodeName, updateDocumentTitle } from '@/utils/functions';

// Variables
const props = defineProps(['name', 'id'])
const player = ref(null)

// Update document title
watch(() => props.name, () => updateDocumentTitle(`WL Index | ${unencodeName(props.name)} | TennisHistory`), { immediate: true })

// API call
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
    <IndexChart v-if="player" :player />
    <Loading v-else :loading>
        <template #none>No data available</template>
    </Loading>
</template>