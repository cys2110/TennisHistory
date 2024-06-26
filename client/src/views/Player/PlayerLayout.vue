<script setup lang="ts">
import { ref, watch, type Ref } from 'vue';
import { useDisplay } from 'vuetify';
import { provideApolloClient, useQuery } from '@vue/apollo-composable';
import apolloClient from '@/apollo';
import { getPlayer } from '@/services/APICalls';
import { gladiator, headshot, formatDate, formatCurrency, flagSrc } from '@/components/utils';
import type { PlayerDetails } from '@/components/interfaces';

provideApolloClient(apolloClient)

const props = defineProps<{
    id: string,
    name: string
}>()
const { mdAndUp } = useDisplay()

const { query, variables } = getPlayer(props.id)
const { result, loading, error } = useQuery(query, variables)

const player: Ref<PlayerDetails | null> = ref(null)
const selectedTab: Ref<string> = ref('Overview')
const tabs = [
    {id: 1, name: 'Overview', to: 'Player'},
    {id: 2, name: 'Activity', to: 'Activity'},
    {id: 3, name: 'Titles and Finals', to: 'Titles'},
    {id: 4, name: 'WL Index', to: 'WL Index'},
    {id: 5, name: 'Stats', to: 'Player Stats'}
]

const updateDocumentTitle = () => {
    document.title = `${props.name.replace(/_/g, ' ')} | TennisHistory`
}

watch(() => props.name, () => {
    updateDocumentTitle()
}, {immediate: true})

watch(result, (newResult) => {
    if (newResult) {
        player.value = newResult.players[0]
    }
}, {immediate: true})

watch(error, (newError) => {
    if (newError) {
        console.error(newError)
    }
})
</script>

<template>
    <v-sheet class="w-5/6 md:w-8/12 lg:w-1/2 mx-auto my-3 bg-transparent">
        <v-container v-if="player">
            <v-row>
                <v-col
                    class="text-zinc-300"
                    cols="12"
                    md="9"
                    :order="mdAndUp ? 1 : 2"
                >
                    <div>
                        <div class="my-2 text-center sm:!flex sm:!justify-center md:!justify-start sm:!items-center">
                            <div class="text-xl sm:text-3xl lg:text-5xl">{{ player.first_name }} {{ player.last_name.toUpperCase() }}</div>
                            <div class="m-1 sm:!ml-2">
                                <v-chip
                                    v-if="!player.retired"
                                    class="!bg-indigo-800"
                                    variant="text"
                                    text="Active"
                                    density="compact"
                                />
                                <v-chip
                                    v-else
                                    class="!bg-indigo-800"
                                    variant="text"
                                    text="Retired"
                                    density="compact"
                                />
                            </div>
                        </div>
                        <div class="flex justify-evenly items-center md:justify-start my-3 lg:!mt-6">
                            <div class="w-1/3 md:w-1/5 lg:w-1/12 px-1">
                                <flag-img
                                    class="mx-1"
                                    :src="flagSrc(player.countryConnection.edges[0].node.id)"
                                    :alt="player.countryConnection.edges[0].node.name"
                                    :width="mdAndUp ? 100 : 150"
                                >
                                    <!-- <v-tooltip
                                        v-if="player.prev_countriesConnection.edges.length > 0"
                                        content-class="!bg-indigo-600 !text-zinc-300 !text-sm"
                                        :text="player.retired ? `${player.countryConnection.edges[0].properties.start_date} - ${player.retired.year}` : `${player.countryConnection.edges[0].properties.start_date} - present`"
                                        activator="parent"
                                        location="bottom"
                                        height="30"
                                    /> -->
                                </flag-img>
                            </div>
                            <!-- <div
                            v-if="player.prev_countriesConnection.edges.length > 0"
                            v-for="country in player.prev_countriesConnection.edges"
                            :key="country.node.code"
                            class="w-1/3 md:w-1/5 lg:w-1/12 px-1"
                            >
                                <flag-img
                                    class="mx-1"
                                    :src="flagSrc(country.node.code)"
                                    :alt="country.node.name"
                                    :width="mdAndUp ? 100 : 400"
                                >
                                    <v-tooltip
                                        content-class="!bg-indigo-600 !text-zinc-300 !text-sm"
                                        :text="`${country.properties.start_date} - ${country.properties.end_date}`"
                                        activator="parent"
                                        location="bottom"
                                        height="30"
                                    />
                                </flag-img>
                            </div> -->
                        </div>
                    </div>
                    <div class="sm:!flex sm:!justify-evenly sm:!items-center bg-indigo-800 rounded-xl p-3 lg:!mt-6">
                        <div
                            v-if="player.ch_date"
                            class="flex-col text-center m-2"
                        >
                            <div class="font-bold lg:text-2xl">{{ player.career_high }}</div>
                            <div class="text-xs lg:text-sm">{{ formatDate(player.ch_date) }}</div>
                            <div class="text-xs lg:text-sm">CAREER HIGH</div>
                        </div>
                        <div class="flex-col text-center m-2">
                            <div class="font-bold lg:text-2xl">{{ player.win }}-{{ player.loss }}</div>
                            <div class="text-xs lg:text-sm">WIN-LOSS</div>
                        </div>
                        <div class="flex-col text-center m-2">
                            <div class="font-bold lg:text-2xl">{{ player.titles }}</div>
                            <div class="text-xs lg:text-sm">TITLES</div>
                        </div>
                        <div class="flex-col text-center m-2">
                            <div class="font-bold lg:text-2xl">{{ formatCurrency('USD', player.pm_USD) }}</div>
                            <div class="text-xs lg:text-sm">PRIZE MONEY</div>
                        </div>
                    </div>
                </v-col>
                <v-col
                    cols="12"
                    md="3"
                    :order="mdAndUp ? 2 : 1"
                >
                    <v-img
                        class="max-h-80"
                        :class="{'!border-2': !player.gladiator, '!border-zinc-300': !player.gladiator}"
                        :src="player.gladiator ? gladiator(player.id) : headshot(player.id)"
                        :alt="player.full_name"
                        :rounded="player.gladiator ? 'xl' : 'circle'"
                    />
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-toolbar class="rounded-t-xl bg-zinc-700">
                        <v-tabs
                            v-model="selectedTab"
                            show-arrows
                            color="#d4d4d8"
                        >
                            <v-tab
                                v-for="tab in tabs"
                                :key="tab.id"
                                :to="{name: tab.to}"
                            >
                                {{ tab.name }}
                            </v-tab>
                        </v-tabs>
                    </v-toolbar>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <!-- <v-tabs-window v-model="selectedTab"> -->
                        <!-- <v-tabs-window-item> -->
                            <router-view :player/>
                        <!-- </v-tabs-window-item> -->
                    <!-- </v-tabs-window> -->
                </v-col>
            </v-row>
        </v-container>
        <div v-else>
            <div class="text-3xl text-zinc-300">{{ props.name.replace(/_/g, ' ') }}</div>
            <div class="text-zinc-400 my-3">No data available yet</div>
        </div>
    </v-sheet>
</template>