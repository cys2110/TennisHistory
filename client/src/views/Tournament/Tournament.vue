<script setup lang="ts">
import { computed, ref, type Ref, watch } from 'vue';
import apolloClient from '@/apollo';
import { provideApolloClient, useQuery } from '@vue/apollo-composable';
import { getTournament } from '@/services/TournamentService';
import type { TournamentDetails } from '@/utils/interfaces';
import { unencodeName } from '@/utils/functions';
import TournamentCard from '@/components/Tournament/TournamentCard.vue';

provideApolloClient(apolloClient)

const props = defineProps<{
    id: string
    name: string
}>()

const { query, variables } = getTournament(parseInt(props.id))
const { result, loading, error} = useQuery(query, variables)

const tournament: Ref<TournamentDetails | null> = ref(null)

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

const updateDocumentTitle = () => {
    document.title = `${unencodeName(props.name)} | TennisHistory`
}

watch(() => props.name, () => {
    updateDocumentTitle()
}, {immediate: true})

const years = computed(() => {
    return !tournament.value?.end_year ? `${tournament.value?.start_year.id} - present` :
        tournament.value.start_year === tournament.value.end_year ? tournament.value.start_year.id :
        `${tournament.value.start_year.id} - ${tournament.value.end_year.id}`
})
</script>

<template>
    <v-sheet
        class="bg-transparent m-16 pa-3 mx-auto w-75"
    >
        <v-container
            v-if="tournament"
        >
            <v-row>
                <div
                    class="text-zinc-300 text-3xl"
                >
                    {{ tournament.name }}
                </div>
                <div
                    class="text-xs ml-3"
                >
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
                            text="Tournament Website"
                            activator="parent"
                            location="end"
                            height="30"
                        />
                    </a>
                </div>
            </v-row>
            <v-row
                class="text-xl my-5 text-zinc-300"
            >
                {{ years }}
            </v-row>
            <v-row>
                <v-col
                    v-for="event in tournament.events"
                    :key="event.id"
                    cols="12"
                    sm="6"
                    lg="4"
                    xl="3"
                >
                    <TournamentCard
                        :event
                    />
                </v-col>
            </v-row>
        </v-container>
        <div v-else>
            <div
                class="text-3xl mb-3 text-zinc-300"
            >
                {{ unencodeName(name) }}
            </div>
            <div
                class="text-zinc-400"
            >
                No data available yet
            </div>
        </div>
    </v-sheet>
</template>