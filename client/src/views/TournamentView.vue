<script setup lang="ts">
import { computed, onMounted, ref, type Ref, watch } from 'vue';
import TournamentCard from '@/components/Tournament/TournamentCard.vue';
import TournamentService from '@/services/TournamentService';
import type { TournamentDetails } from '@/components/interfaces';

const props = defineProps<{
    id: string,
    name: string
}>()
const tournament: Ref<TournamentDetails | null> = ref(null)

const years = computed(() => {
    return !tournament.value?.end_year ? `${tournament.value?.start_year} - present` :
        tournament.value.start_year === tournament.value.end_year ? tournament.value.start_year :
        `${tournament.value.start_year} - ${tournament.value.end_year}`
})

onMounted(() => {
    TournamentService.getTournamentById(parseInt(props.id))
    .then(response => tournament.value = response.data)
    .catch(e => console.log(e))
})

const updateDocumentTitle = () => {
    const tournamentName = props.name
    document.title = `${tournamentName.replace(/_/g, ' ')} | TennisHistory`
}

watch(() => props.name, () => {
    updateDocumentTitle()
}, {immediate: true})
</script>

<template>
    <view-sheet>
        <v-container v-if="tournament">
            <v-row>
                <div class="text-zinc-300 text-3xl">{{ tournament.name }}</div>
                <div class="text-xs ml-3">
                    <a
                        v-if="tournament.website"
                        :href="tournament.website"
                        target="_blank"
                    >
                        <v-icon
                            icon="fad fa-arrow-up-right-from-square"
                            :href="tournament.website"
                        />
                        <v-tooltip
                            content-class="!bg-indigo-800 !text-zinc-300 !text-sm"
                            text="Go to website"
                            activator="parent"
                            location="end"
                            height="30"
                        />
                    </a>
                </div>
            </v-row>
            <v-row class="text-xl my-5 text-zinc-300">{{ years }}</v-row>
            <v-row>
                <v-col
                    v-for="edition in tournament.Editions"
                    :key="edition.id"
                    cols="12"
                    sm="6"
                    lg="3"
                >
                    <TournamentCard :edition />
                </v-col>
            </v-row>
        </v-container>
        <div v-else>
            <div class="text-3xl mb-3 text-zinc-300">{{ name.replace('_', ' ') }}</div>
            <div class="text-zinc-400">No data available yet</div>
        </div>
    </view-sheet>
</template>