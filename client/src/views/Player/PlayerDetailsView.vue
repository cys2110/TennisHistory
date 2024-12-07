<script setup lang="ts">
import { Ref, ref, watch } from 'vue';
import { useQuery } from '@vue/apollo-composable';
import { GET_PLAYER } from '@/services/PlayerService';
import { gladiator, headshot, unencodeName, updateDocumentTitle } from '@/utils/functions';
import { PlayerDetailsType } from '@/utils/types';

// [TODO: FIGURE OUT MAJOR RESULTS APICALL]

// Variables
const props = defineProps<{
    name: string,
    id: string
}>()
const player: Ref<PlayerDetailsType | null> = ref(null)

// Update document title
watch(() => props.name, () => updateDocumentTitle(`${unencodeName(props.name)} | TennisHistory`), { immediate: true })

// API call
const { query, variables } = GET_PLAYER(props.id)
const { result, loading, error } = useQuery(query, variables)

watch(result, (newResult) => {
    if (newResult) player.value = newResult.players[0]
})
watch(error, (newError) => {
    if (newError) console.error(newError)
})
</script>

<template>
    <a-row v-if="player">
        <a-col :xs="24" :sm="4">
            <a-image :alt="player.full_name" :src="player.gladiator ? gladiator(player.id) : headshot(player.id)"
                :preview="false" class="rounded-full" />
        </a-col>
        <a-col :xs="24" :sm="20">
            <PlayerDetails :player />
            <!--[TODO: INSERT MAJOR RESULTS TABLE]-->
        </a-col>
    </a-row>
    <Loading v-else :loading>
        <template #none>No data available</template>
    </Loading>
</template>