<script setup lang="ts">
import { ref, watch, type Ref } from 'vue';
import { useDisplay } from 'vuetify';
import apolloClient from '@/apollo';
import { provideApolloClient, useQuery } from '@vue/apollo-composable';
import { getPlayerLayout } from '@/services/PlayerService';
import type { PlayerLayout } from '@/utils/interfaces';
import { unencodeName, formatDate, formatCurrency, headshot, gladiator, flag, smallDate } from '@/utils/functions';
import Loading from '@/components/Loading.vue'

provideApolloClient(apolloClient)
const { mdAndUp } = useDisplay()

const props = defineProps<{
    id: string,
    name: string
}>()

const { query, variables } = getPlayerLayout(props.id)
const { result, loading, error } = useQuery(query, variables)

const player: Ref<PlayerLayout | null> = ref(null)
const tab: Ref<string> = ref('Overview')

const tabs = [
    { id: 1, name: 'Overview', to: 'Player' },
    { id: 2, name: 'Activity', to: 'Activity' },
    { id: 3, name: 'Titles and Finals', to: 'Titles' },
    { id: 4, name: 'WL Index', to: 'WL Index' },
    { id: 5, name: 'Stats', to: 'Player Stats' }
]

const updateDocumentTitle = () => document.title = `${unencodeName(props.name)} | TennisHistory`

watch(() => props.name, () => {
    updateDocumentTitle()
}, { immediate: true })

watch(result, (newResult) => {
    if (newResult) player.value = newResult.players[0]
}, { immediate: true })

watch(error, (newError) => {
    if (newError) console.error(newError)
}, { immediate: true })
</script>

<template>
    <v-sheet class="w-5/6 md:w-8/12 lg:w-1/2 mx-auto my-3 bg-transparent">
        <v-container v-if="player">
            <v-row>
                <v-col class="text-zinc-300" cols="12" md="9" :order="mdAndUp ? 1 : 2">
                    <div class="my-10">
                        <div class="my-2 text-center sm:!flex sm:!justify-center md:!justify-start sm:!items-center">
                            <div class="text-xl sm:text-3xl lg:text-5xl">
                                {{ player.first_name }} {{ player.last_name.toUpperCase() }}
                            </div>
                        </div>
                        <div class="flex justify-evenly items-center md:justify-start my-3 lg:!mt-6">
                            <div class="w-1/3 md:w-1/5 px-1">
                                <flag-img class="mx-1" :src="flag(player.countryConnection.edges[0].node.id)"
                                    :alt="player.countryConnection.edges[0].node.name" :width="mdAndUp ? 100 : 150">
                                    <v-tooltip v-if="player.countryConnection.edges[0].properties.start_date"
                                        content-class="!bg-indigo-600 !text-zinc-300 !text-sm" activator="parent"
                                        location="bottom" height="30">
                                        {{ smallDate(player.countryConnection.edges[0].properties.start_date) }}-{{
                                            player.countryConnection.edges[0].properties.end_date ?
                                                smallDate(player.countryConnection.edges[0].properties.end_date) : 'present' }}
                                    </v-tooltip>
                                </flag-img>
                            </div>
                            <div v-if="player.prev_countriesConnection.edges.length > 0"
                                v-for="country in player.prev_countriesConnection.edges" :key="country.node.id"
                                class="w-1/3 md:w-1/5 px-1">
                                <flag-img class="mx-1" :src="flag(country.node.id)" :alt="country.node.name"
                                    :width="mdAndUp ? 100 : 400">
                                    <v-tooltip content-class="!bg-indigo-600 !text-zinc-300 !text-sm" activator="parent"
                                        location="bottom" height="30">
                                        {{ smallDate(country.properties.start_date) }}-{{
                                            smallDate(country.properties.end_date) }}
                                    </v-tooltip>
                                </flag-img>
                            </div>
                        </div>
                    </div>
                    <div
                        class="sm:!flex sm:!flex-wrap sm:!justify-evenly sm:!items-center bg-indigo-800 rounded-xl p-3 lg:!mt-6">
                        <div v-if="player.ch_date" class="flex-col text-center m-2">
                            <div class="font-bold lg:text-2xl">
                                {{ player.career_high }}
                            </div>
                            <div class="text-xs lg:text-sm">
                                {{ formatDate(player.ch_date) }}
                            </div>
                            <div class="text-xs lg:text-sm">
                                CAREER HIGH
                            </div>
                        </div>
                        <div class="flex-col text-center m-2">
                            <div class="font-bold lg:text-2xl">
                                {{ player.win }}-{{ player.loss }}
                            </div>
                            <div class="text-xs lg:text-sm">
                                WIN-LOSS
                            </div>
                        </div>
                        <div class="flex-col text-center m-2">
                            <div class="font-bold lg:text-2xl">
                                {{ player.titles }}
                            </div>
                            <div class="text-xs lg:text-sm">
                                TITLES
                            </div>
                        </div>
                        <div class="flex-col text-center m-2">
                            <div class="font-bold lg:text-2xl">
                                {{ formatCurrency('USD', player.pm_USD) }}
                            </div>
                            <div class="text-xs lg:text-sm">
                                PRIZE MONEY
                            </div>
                        </div>
                    </div>
                </v-col>
                <v-col cols="12" md="3" :order="mdAndUp ? 2 : 1">
                    <v-img class="max-h-80"
                        :class="{ '!border-2': !player.gladiator, '!border-zinc-300': !player.gladiator, 'my-10': !player.gladiator }"
                        :src="player.gladiator ? gladiator(player.id) : headshot(player.id)" :alt="player.full_name"
                        :rounded="player.gladiator ? 'xl' : 'circle'" />
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-toolbar class="rounded-t-xl bg-zinc-700">
                        <v-tabs v-model="tab" show-arrows color="#d4d4d8">
                            <v-tab v-for="tab in tabs" :key="tab.id" :to="{ name: tab.to }">
                                {{ tab.name }}
                            </v-tab>
                        </v-tabs>
                    </v-toolbar>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <router-view :player />
                </v-col>
            </v-row>
        </v-container>
        <div v-else>
            <div class="text-3xl text-zinc-300">
                {{ unencodeName(name) }}
            </div>
            <Loading :loading>
                <template #None>No data available yet</template>
            </Loading>
        </div>
    </v-sheet>
</template>