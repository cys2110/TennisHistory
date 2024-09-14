<script setup lang="ts">
import { ref, watch, type Ref } from 'vue';
import { useDisplay } from 'vuetify';
import apolloClient from '@/apollo';
import { provideApolloClient, useQuery } from '@vue/apollo-composable';
import { getDraw } from '@/services/EventService';
import type { Match, EntryInfo } from '@/utils/interfaces';
import Loading from '@/components/Global/Loading.vue';
import DrawCard from '@/components/Event/DrawCard.vue';

provideApolloClient(apolloClient)
const { mdAndUp, xl } = useDisplay()

const props = defineProps<{
    name: string,
    id: string,
    year: string,
    eventId: string
}>()

const rounds: Ref<{ round: string; number: number; matches: Match[] }[]> = ref([])
const entryInfo: Ref<{ node: { id: string }; properties: EntryInfo; }[]> = ref([])
const tab: Ref<number> = ref(1)

const { query, variables } = getDraw(parseInt(props.eventId))
const { result, loading, error } = useQuery(query, variables)

watch(result, (newResult) => {
    if (newResult) {
        entryInfo.value = newResult.events[0].playersConnection.edges
        rounds.value = newResult.events[0].rounds
    }
}, { immediate: true })

watch(error, (newError) => {
    if (newError) console.error(newError)
})

const shortRound = (fullRound: string) => {
    switch (fullRound) {
        case 'Round of 128':
            return 'R128'
        case 'Round of 64':
            return 'R64'
        case 'Round of 32':
            return 'R32'
        case 'Round of 16':
            return 'R16'
        case 'Quarterfinals':
            return 'QF'
        case 'Semifinals':
            return 'SF'
        case 'Final':
            return 'F'
    }
}
</script>

<template>
    <v-container v-if="rounds.length > 0">
        <v-tabs v-model="tab" show-arrows>
            <template v-for="round in rounds" :key="round.round">
                <v-tab v-if="round.number" :value="round.number">{{ shortRound(round.round) }}</v-tab>
            </template>
        </v-tabs>
        <v-row>
            <template v-for="round in rounds" :key="round.round">
                <v-col
                    v-if="tab === round.number || mdAndUp && (tab === round.number || tab === round.number + 1) || xl && (tab === round.number || tab === round.number + 2 || tab === round.number + 1)"
                    class="flex flex-col justify-space-around" cols="12" md="6" xl="4">
                    <DrawCard v-for="match in round.matches" :key="match.match_no" :match :entryInfo :name
                        :tournamentId="parseInt(id)" :year="parseInt(year)" :eventId="parseInt(eventId)"
                        :matchId="match.match_no" />
                </v-col>
            </template>
        </v-row>
    </v-container>
    <Loading v-else :loading>
        <template #None>No data available</template>
    </Loading>
</template>