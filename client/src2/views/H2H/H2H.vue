<script setup lang="ts">
import { ref, watch, type Ref } from 'vue';
import apolloClient from '@/apollo';
import { provideApolloClient, useQuery } from '@vue/apollo-composable';
import { useDisplay } from 'vuetify';
import { getH2H } from '@/services/H2HService';
import type { H2H } from '@/utils/interfaces';
import * as func from '@/utils/functions';
import Title from '@/components/Global/Title.vue';
import Loading from '@/components/Global/Loading.vue';
import PlayerTable from '@/components/H2H/PlayerTable.vue';
import H2HTable from '@/components/H2H/H2HTable.vue';
import MatchTable from '@/components/H2H/MatchTable.vue'

provideApolloClient(apolloClient)
const { mdAndUp, smAndUp } = useDisplay()

const props = defineProps<{
    p1Id: string,
    p2Id: string,
    p1Name: string,
    p2Name: string
}>()

const h2h: Ref<H2H | null> = ref(null)

const { query, variables } = getH2H(props.p1Id, props.p2Id)
const { result, loading, error } = useQuery(query, variables)

watch(result, (newResult) => {
    if (newResult) h2h.value = newResult
}, { immediate: true })

watch(error, (newError) => {
    if (newError) console.error(newError)
})

const updateDocumentTitle = () => {
    document.title = `${func.unencodeName(props.p1Name)} v. ${func.unencodeName(props.p2Name)} | TennisHistory`
}

watch(() => [props.p1Name, props.p2Name], () => {
    updateDocumentTitle()
}, { immediate: true })
</script>

<template>
    <v-sheet class="text-zinc-300 w-5/6 md:w-2/3 mx-auto my-10 bg-transparent">
        <v-container v-if="h2h">
            <v-row>
                <v-col cols="4">
                    <v-img v-if="h2h.p1" class="border-2 border-zinc-400 mx-auto my-3 sm:w-5/6 md:w-2/3"
                        :src="func.headshot(h2h.p1[0].id)" :alt="h2h.p1[0].full_name" rounded="circle" />
                </v-col>
                <v-col class="flex items-center justify-center" cols="4">
                    <div class="text-xl text-zinc-300 flex flex-col items-center">
                        <span>{{ h2h.p1Wins.count }}</span>
                        <span>
                            {{ func.percentage(h2h.p1Wins.count, h2h.p2Wins.count + h2h.p1Wins.count).toFixed(0) }}%
                        </span>
                    </div>
                    <div class="mx-3">
                        <v-progress-circular :size="mdAndUp ? 200 : smAndUp ? 100 : 50" color="#3730a3"
                            bg-color="#166534"
                            :model-value="func.percentage(h2h.p1Wins.count, h2h.p1Wins.count + h2h.p2Wins.count)"
                            rotate="120">
                            <div class="text-zinc-300 text-lg text-center">
                                {{ h2h.p1Wins.count + h2h.p2Wins.count }}
                                <br>
                                matches
                                <br>
                                played
                            </div>
                        </v-progress-circular>
                    </div>
                    <div class="text-xl text-zinc-300 flex flex-col items-center">
                        <span>{{ h2h.p2Wins.count }}</span>
                        <span>
                            {{ func.percentage(h2h.p2Wins.count, h2h.p2Wins.count + h2h.p1Wins.count).toFixed(0) }}%
                        </span>
                    </div>
                </v-col>
                <v-col cols="4">
                    <v-img v-if="h2h.p2" class="border-2 border-zinc-400 mx-auto my-3 sm:w-5/6 md:w-2/3"
                        :src="func.headshot(h2h.p2[0].id)" :alt="h2h.p2[0].full_name" rounded="circle" />
                </v-col>
            </v-row>
            <v-row>
                <v-col class="flex-col items-center" cols="4">
                    <div class="sm:!flex sm:!justify-center bg-indigo-800 p-2 rounded-xl">
                        <div>
                            <flag-img v-if="h2h.p1[0].country" class="w-[2rem] mx-auto my-1"
                                :src="func.flag(h2h.p1[0].country.id)" :alt="func.flag(h2h.p1[0].country.name)" />
                        </div>
                        <div class="text-center text-lg sm:mx-1">
                            <router-link class="hover-link uppercase font-bold"
                                :to="{ name: 'Player', params: { id: h2h.p1[0].id, name: func.encodeName(h2h.p1[0].full_name) } }">
                                {{ h2h.p1[0].full_name }}
                            </router-link>
                        </div>
                    </div>
                </v-col>
                <v-spacer />
                <v-col class="flex-col items-center" cols="4">
                    <div class="sm:!flex sm:!justify-center bg-green-800 p-2 rounded-xl">
                        <div>
                            <flag-img v-if="h2h.p2[0].country" class="w-[2rem] mx-auto my-1"
                                :src="func.flag(h2h.p2[0].country.id)" :alt="func.flag(h2h.p2[0].country.name)" />
                        </div>
                        <div class="text-center text-lg sm:mx-1">
                            <router-link class="hover-link uppercase font-bold"
                                :to="{ name: 'Player', params: { id: h2h.p2[0].id, name: func.encodeName(h2h.p2[0].full_name) } }">
                                {{ h2h.p2[0].full_name }}
                            </router-link>
                        </div>
                    </div>
                </v-col>
            </v-row>
            <v-row>
                <PlayerTable :player="h2h.p1[0]" :p1="true" />
                <H2HTable :p1="h2h.p1[0]" :p2="h2h.p2[0]" />
                <PlayerTable :player="h2h.p2[0]" :p1="false" />
            </v-row>
            <v-row>
                <v-col>
                    <MatchTable :matches="h2h.matches" />
                </v-col>
            </v-row>
        </v-container>
        <div v-else>
            <Title>
                <template #title>{{ func.unencodeName(p1Name) }} v. {{ func.unencodeName(p2Name) }}</template>
            </Title>
            <Loading :loading>
                <template #none>No data available</template>
            </Loading>
        </div>
    </v-sheet>
</template>