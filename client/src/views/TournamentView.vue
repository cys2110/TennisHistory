<script setup lang="ts">
import { computed, ref, type Ref, watch } from 'vue';
import { provideApolloClient, useQuery } from '@vue/apollo-composable';
import apolloClient from '@/apollo';
import { getTournament } from '@/services/APICalls';
import TournamentCard from '@/components/Tournament/TournamentCard.vue';
import type { TournamentDetails } from '@/components/interfaces';

provideApolloClient(apolloClient)

const props = defineProps<{
    id: string,
    name: string
}>()
const tournament: Ref<TournamentDetails | null> = ref(null)

const { query, variables } = getTournament(parseInt(props.id))
const { result, loading, error} = useQuery(query, variables)

watch(result, (newResult) => {
    if (newResult) {
        tournament.value = newResult.tournaments[0]
    }
}, {immediate: true})

watch(error, (newError) => {
    if (newError) {
        console.error(newError)
    }
})

const years = computed(() => {
    return !tournament.value?.end_year ? `${tournament.value?.start_year.id} - present` :
        tournament.value.start_year === tournament.value.end_year ? tournament.value.start_year.id :
        `${tournament.value.start_year.id} - ${tournament.value.end_year.id}`
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
                    v-for="event in tournament.events"
                    :key="event.id"
                    cols="12"
                    sm="6"
                    lg="3"
                >
                    <TournamentCard :event />
                </v-col>
            </v-row>
        </v-container>
        <div v-else>
            <div class="text-3xl mb-3 text-zinc-300">{{ name.replace('_', ' ') }}</div>
            <div class="text-zinc-400">No data available yet</div>
        </div>
    </view-sheet>
</template>