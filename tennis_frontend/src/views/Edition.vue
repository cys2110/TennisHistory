<script setup>
import EditionService from '@/services/EditionService';
import { onMounted, ref } from 'vue';
import { categorySrc, formattedDates, flagSrc } from '@/components/utils';
import { RouterLink } from 'vue-router';
import OverviewWindow from '@/components/Edition/OverviewWindow.vue';
import ResultsWindow from '@/components/Edition/ResultsWindow.vue';
import DrawWindow from '@/components/Edition/DrawWindow.vue';

const props = defineProps(['editionId'])
const edition = ref(null)
const matches = ref([])
const tab = ref('draw')

onMounted(() => {
    EditionService.getEditionById(props.editionId)
    .then (response => {
        edition.value = response.data
        matches.value = response.data.MatchScores
    })
    .catch(error => console.log(error))
})
</script>

<template>
    <v-sheet class="bg-transparent my-10 pa-3 w-75 mx-auto">
        <v-container v-if="edition && matches.length > 0">
            <v-row>
                <v-col cols="2">
                    <v-img :src="categorySrc(edition.category)" class="filter"></v-img>
                </v-col>
                <v-col class="d-flex flex-column">
                    <div class="text-h5"><RouterLink class="hover-link" :to="{name: 'Tournament', params: {name: edition.Tournament.name, id: edition.TournamentId}}">{{ edition.Tournament.name }}</RouterLink></div>
                    <div class="text-h5" v-if="edition.sponsor_name">{{ edition.sponsor_name }}</div>
                    <div class="text-subtitle-1">{{ formattedDates(edition.start_date, edition.end_date) }}</div>
                </v-col>
                <v-col cols="2">
                    <v-img class="flag" :src="flagSrc(edition.country)"></v-img>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-toolbar  color="indigo-accent-4" rounded="xl">
                        <v-tabs v-model="tab">
                            <v-tab value="overview">Overview</v-tab>
                            <v-tab value="results">Results</v-tab>
                            <v-tab value="draw">Draw</v-tab>
                        </v-tabs>
                    </v-toolbar>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-window v-model="tab">
                        <v-window-item value="overview">
                            <OverviewWindow :edition />
                        </v-window-item>
                        <v-window-item value="results">
                            <ResultsWindow :edition :matches />
                        </v-window-item>
                        <v-window-item value="draw">
                            <DrawWindow :edition :matches />
                        </v-window-item>
                    </v-window>
                </v-col>
            </v-row>
        </v-container>
        <div v-else class="text-h3">Loading...</div>
    </v-sheet>
</template>