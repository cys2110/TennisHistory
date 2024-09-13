<script setup lang="ts">
import { ref, watch, type Ref, nextTick, onMounted } from 'vue';
import apolloClient from '@/apollo';
import { provideApolloClient, useQuery } from '@vue/apollo-composable';
import { getDraw } from '@/services/EventService';
import type { ActivityEntry, Round } from '@/utils/interfaces';
import DrawCard from '@/components/Event/DrawCard.vue';
import Loading from '@/components/Loading.vue';

provideApolloClient(apolloClient)

const props = defineProps<{
    name: string,
    id: string,
    year: string,
    eventId: string
}>()

const rounds: Ref<Round[]> = ref([])
const entryInfo: Ref<ActivityEntry[]> = ref([])
const tab: Ref<number> = ref(1)
const index: Ref<Round | undefined> = ref(rounds.value.find(obj => obj.number === tab.value))

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
</script>

<template>
    <v-container v-if="rounds.length > 0">
        <v-tabs v-model="tab" show-arrows>
            <v-tab v-for="round in rounds" :key="round.round" :value="round.number">{{ round.round }}</v-tab>
        </v-tabs>
        <v-row>
            <v-col cols="4" class="d-flex flex-column justify-space-around">
                <DrawCard v-for="match in index.matches" :key="match.id" :match :entryInfo :name
                    :tournamentId="parseInt(id)" :year="parseInt(year)" :eventId="parseInt(eventId)" />
            </v-col>
            <!-- <template v-for="round in rounds" :key="round.round">
                        <v-col
                            v-if="selectedRound === round.number || selectedRound === round.number + 2 || selectedRound === round.number + 1"
                            class="d-flex flex-column justify-space-around" cols="12" md="6" xl="4">
                            <DrawCard v-for="match in round.matches" :key="match.match_no" :match :entryInfo :name
                                :tournamentId="parseInt(id)" :year="parseInt(year)" :eventId="parseInt(eventId)" />
                        </v-col>
                    </template> -->
        </v-row>
    </v-container>
    <Loading v-else :loading>
        <template #None>No data available</template>
    </Loading>
</template>