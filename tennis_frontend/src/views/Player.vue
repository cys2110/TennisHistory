<script setup>
import PlayerService from '@/services/PlayerService';
import OverviewWindow from '@/components/Player/OverviewWindow.vue';
import { onMounted, ref } from 'vue';
import { flagSrc, formatDate, formatCurrency, gladiator, headshot } from '@/components/utils';
import TitlesWindow from '@/components/Player/TitlesWindow.vue';
import WLIndexWindow from '@/components/Player/WLIndexWindow.vue';
import StatsWindow from '@/components/Player/StatsWindow.vue';
import ActivityWindow from '@/components/Player/ActivityWindow.vue';

const props = defineProps(['id'])
const player = ref(null)
const tab = ref('overview')

onMounted(() => {
    PlayerService.getPlayerById(props.id)
    .then(response => player.value = response.data)
    .catch(error => console.log(error))
})
</script>

<template>
    <view-sheet>
        <v-container v-if="player">
            <v-row>
                <v-col cols="7" sm="10" class="d-flex flex-column justify-space-evenly">
                    <div class="d-sm-flex align-center">
                        <div class="text-h6 text-sm-h4 text-md-h2">{{ player.first_name }} {{ player.last_name.toUpperCase() }}</div>
                        <div>
                            <flag-img
                                :src="flagSrc(player.country)"
                                :alt="player.country"
                                class="flag"
                            />
                        </div>
                    </div>
                    <div class="my-2">
                        <v-chip
                            v-if="player.status"
                            variant="elevated"
                            color="indigo-accent-4"
                        >
                            Active
                        </v-chip>
                    </div>
                    <div class="d-sm-flex align-self-center my-2 align-space-between justify-space-around bg-indigo-accent-4 rounded-pill py-5 w-100">
                        <div class="d-flex flex-column mx-2 align-center justify-center">
                            <div class="text-h6 text-lg-h4">{{ player.career_high }}</div>
                            <div class="text-body-1 text-lg-subtitle-1">{{ formatDate(player.ch_date) }}</div>
                            <div class="text-body-1 text-lg-subtitle-1">CAREER HIGH</div>
                        </div>
                        <div class="d-flex flex-column mx-2 align-center justify-center">
                            <div class="text-h6 text-lg-h4">{{ player.win }}-{{ player.loss }}</div>
                            <div class="text-body-1 text-md-subtitle-1">WIN-LOSS</div>
                        </div>
                        <div class="d-flex flex-column mx-2 align-center justify-center">
                            <div class="text-h6 text-lg-h4">{{ player.titles }}</div>
                            <div class="text-body-1 text-lg-subtitle-1">TITLES</div>
                        </div>
                        <div class="d-flex flex-column mx-2 align-center justify-center">
                            <div class="text-h6 text-lg-h4">{{ formatCurrency('USD', player.pm_USD) }}</div>
                            <div class="text-body-1 text-lg-subtitle-1">PRIZE MONEY</div>
                        </div>
                    </div>
                </v-col>
                <v-col v-if="player.gladiator || player.headshot">
                    <v-img
                        v-if="player.gladiator"
                        :src="gladiator(player.id)"
                        :alt="player.full_name"
                        rounded="xl"
                    />
                    <v-img
                        v-else
                        :src="headshot(player.id)"
                        rounded="circle"
                        :alt="player.full_name"
                    />
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-toolbar color="indigo-accent-4" class="rounded-t-xl">
                        <v-tabs v-model="tab" show-arrows="">
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
                            <OverviewWindow :player/>
                        </v-window-item>
                        <v-window-item value="activity">
                            <ActivityWindow :player />
                        </v-window-item>
                        <v-window-item value="titles">
                            <TitlesWindow :player />
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
    </view-sheet>
</template>

<style scoped>
.flag {
    margin-left: 2rem;
    width: 3rem;
}
</style>