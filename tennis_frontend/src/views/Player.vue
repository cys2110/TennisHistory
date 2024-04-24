<script setup>
import PlayerService from '@/services/PlayerService';
import OverviewWindow from '@/components/Player/OverviewWindow.vue';
import { onMounted, ref, watch } from 'vue';
import { flagSrc, formatDate, formatCurrency, gladiator, headshot } from '@/components/utils';
import { useRouter } from 'vue-router';
import TitlesWindow from '@/components/Player/TitlesWindow.vue';
import WLIndexWindow from '@/components/Player/WLIndexWindow.vue';

const props = defineProps(['id'])
const player = ref(null)
const router = useRouter()
const tab = ref('overview')

onMounted(() => {
    PlayerService.getPlayerById(props.id)
    .then(response => {
        player.value = response.data
    })
    .catch(error => console.log(error))
})

watch(() => router.currentRoute.value.params.id, () => {
        window.location.reload()
})
</script>

<template>
    <v-sheet class="bg-transparent my-10 pa-3 w-75 mx-auto">
        <v-container v-if="player">
            <v-row>
                <v-col cols="8" class="d-flex flex-column">
                    <div class="d-flex">
                        <div class="text-h4">{{ player.first_name }} {{ player.last_name.toUpperCase() }}</div>
                        <div>
                            <v-img class="flag" :src="flagSrc(player.country)" :alt="player.country"></v-img>
                        </div>
                    </div>
                    <div class="my-2">
                        <v-chip v-if="player.status" variant="elevated" color="indigo-accent-4">Active</v-chip>
                    </div>
                    <div class="d-flex align-self-center my-2 align-space-between bg-indigo-accent-4 rounded-pill py-5 px-10">
                        <div class="d-flex flex-column mx-2 align-center justify-center">
                            <div class="text-h4">{{ player.career_high }}</div>
                            <div class="subtitle-1">{{ formatDate(player.ch_date) }}</div>
                            <div class="subtitle-1">CAREER HIGH</div>
                        </div>
                        <div class="d-flex flex-column mx-2 align-center justify-center">
                            <div class="text-h4">{{ player.win }}-{{ player.loss }}</div>
                            <div class="subtitle-1">WIN-LOSS</div>
                        </div>
                        <div class="d-flex flex-column mx-2 align-center justify-center">
                            <div class="text-h4">{{ player.titles }}</div>
                            <div class="subtitle-1">TITLES</div>
                        </div>
                        <div class="d-flex flex-column mx-2 align-center justify-center">
                            <div class="text-h4">{{ formatCurrency('USD', player.pm_USD) }}</div>
                            <div class="subtitle-1">PRIZE MONEY</div>
                        </div>
                    </div>
                </v-col>
                <v-col v-if="player.gladiator || player.headshot">
                    <!-- <v-img v-if="player.gladiator" :src="gladiator(player.id)" :alt="player.full_name" rounded="xl" style="height: 40%"></v-img>
                    <v-img v-else :src="headshot(player.id)" rounded="circle" style="height: 40%" :alt="player.full_name"></v-img> -->
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-toolbar color="indigo-accent-4" rounded="xl">
                        <v-tabs v-model="tab">
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
                            <OverviewWindow />
                        </v-window-item>
                        <v-window-item value="activity"></v-window-item>
                        <v-window-item value="titles">
                            <TitlesWindow />
                        </v-window-item>
                        <v-window-item value="wlIndex">
                            <WLIndexWindow />
                        </v-window-item>
                        <v-window-item value="stats"></v-window-item>
                    </v-window>
                </v-col>
            </v-row>
        </v-container>
    </v-sheet>
</template>

<style scoped>
.flag {
    border-radius: 20%;
    margin-left: 2rem;
    width: 3rem;
}
</style>