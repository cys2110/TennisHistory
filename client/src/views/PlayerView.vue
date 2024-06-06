<script setup lang="ts">
import { onMounted, ref, watch, type Ref } from 'vue';
import { useDisplay } from 'vuetify';
import PlayerService from '@/services/PlayerService';
import OverviewWindow from '@/components/Player/OverviewWindow.vue';
import TitlesWindow from '@/components/Player/TitlesWindow.vue';
import WLIndexWindow from '@/components/Player/WLIndexWindow.vue';
import { gladiator, headshot, formatDate, formatCurrency, flagSrc } from '@/components/utils';
import type { PlayerDetails } from '@/components/interfaces';
import StatsWindow from '@/components/Player/StatsWindow.vue';
import ActivityWindow from '@/components/Player/ActivityWindow.vue';

const props = defineProps<{
    id: string,
    name: string
}>()
const { mdAndUp } = useDisplay()

const player: Ref<PlayerDetails | null> = ref(null)
const tab: Ref<string> = ref('overview')

onMounted(() => {
    PlayerService.getPlayerById(props.id)
    .then(response => player.value = response.data)
    .catch(e => console.log(e))
})

const updateDocumentTitle = () => {
    const playerName = props.name
    document.title = `${playerName.replace(/_/g, ' ')} | TennisHistory`
}

watch(() => props.name, () => {
    updateDocumentTitle()
}, {immediate: true})
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
                                    v-if="player.status"
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
                                    :src="flagSrc(player.country)"
                                    :alt="player.country"
                                    :width="mdAndUp ? 100 : 150"
                                >
                                    <v-tooltip
                                        v-if="player.prev_country"
                                        content-class="!bg-indigo-600 !text-zinc-300 !text-sm"
                                        :text="player.status ? `${player.country_yr} - present` : `${player.country_yr} - ${player.retired}`"
                                        activator="parent"
                                        location="bottom"
                                        height="30"
                                    />
                                </flag-img>
                            </div>
                            <div class="w-1/3 md:w-1/5 lg:w-1/12 px-1" v-if="player.prev_country">
                                <flag-img
                                    class="mx-1"
                                    :src="flagSrc(player.prev_country)"
                                    :alt="player.prev_country"
                                    :width="mdAndUp ? 100 : 400"
                                >
                                    <v-tooltip
                                        content-class="!bg-indigo-600 !text-zinc-300 !text-sm"
                                        :text="player.first_country ? `${player.prev_country_yr} - ${player.country_yr}` : `${player.turned_pro} - ${player.country_yr}`"
                                        activator="parent"
                                        location="bottom"
                                        height="30"
                                    />
                                </flag-img>
                            </div>
                            <div class="w-1/3 md:w-1/5 lg:w-1/12 px-1" v-if="player.first_country">
                                <flag-img
                                    class="mx-1"
                                    :src="flagSrc(player.first_country)"
                                    :alt="player.first_country"
                                    :width="mdAndUp ? 100 : 400"
                                >
                                    <v-tooltip
                                        content-class="!bg-indigo-600 !text-zinc-300 !text-sm"
                                        :text="`${player.turned_pro} - ${player.prev_country_yr}`"
                                        activator="parent"
                                        location="bottom"
                                        height="30"
                                    />
                                </flag-img>
                            </div>
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
                            v-model="tab"
                            show-arrows
                            color="#d4d4d8"
                        >
                            <v-tab value="overview">Overview</v-tab>
                            <v-tab value="activity">Activity</v-tab>
                            <v-tab value="titles">Titles and Finals</v-tab>
                            <v-tab value="wlIndex">Win-Loss Index</v-tab>
                            <v-tab value="stats">Stats</v-tab>
                        </v-tabs>
                    </v-toolbar>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-window v-model="tab">
                        <v-window-item value="overview">
                            <OverviewWindow :player />
                        </v-window-item>
                        <v-window-item value="activity">
                            <ActivityWindow :player />
                        </v-window-item>
                        <v-window-item value="titles">
                            <TitlesWindow :id="player.id" />
                        </v-window-item>
                        <v-window-item value="wlIndex">
                            <WLIndexWindow :id="player.id" />
                        </v-window-item>
                        <v-window-item value="stats">
                            <StatsWindow :player />
                        </v-window-item>
                    </v-window>
                </v-col>
            </v-row>
        </v-container>
        <div v-else>
            <div class="text-3xl text-zinc-300">{{ props.name.replace(/_/g, ' ') }}</div>
            <div class="text-zinc-400 my-3">No data available yet</div>
        </div>
    </v-sheet>
</template>