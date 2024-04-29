<script setup>
import EditionService from '@/services/EditionService';
import { onMounted, ref } from 'vue';
import { categorySrc, formattedDates, flagSrc } from '@/components/utils';
import { RouterLink } from 'vue-router';
import OverviewWindow from '@/components/Edition/OverviewWindow.vue';
import ResultsWindow from '@/components/Edition/ResultsWindow.vue';
import DrawWindow from '@/components/Edition/DrawWindow.vue';
import TeamOverview from '@/components/Edition/TeamOverview.vue';
import TeamGroups from '@/components/Edition/TeamGroups.vue';
import TeamKO from '@/components/Edition/TeamKO.vue';

const props = defineProps(['editionId'])
const edition = ref(null)
const matches = ref([])
const ties = ref([])
const tab = ref('overview')

onMounted(() => {
    EditionService.getEditionById(props.editionId)
    .then (response => {
        edition.value = response.data
        matches.value = response.data.MatchScores
        if (response.data.type_of_draw === 'T') {
            EditionService.getTiesByEdition(response.data.id)
            .then(response => ties.value = response.data)
            .catch(error => console.log(error))
        }
    })
    .catch(error => console.log(error))
})
</script>

<template>
    <v-sheet class="bg-transparent my-10 pa-3 w-75 mx-auto">
        <v-container v-if="edition && matches.length > 0">
            <v-row>
                <v-col cols="2">
                    <v-img
                        :src="categorySrc(edition.category)"
                        :class="{'filter': edition.category === 'ATP 250' || edition.category === 'Next Gen Finals' || edition.category === 'ATP Finals'}"
                    />
                </v-col>
                <v-col class="d-flex flex-column">
                    <div class="text-h5"><RouterLink class="hover-link" :to="{name: 'Tournament'}">{{ edition.Tournament.name }}</RouterLink></div>
                    <div class="text-h5" v-if="edition.sponsor_name">{{ edition.sponsor_name }}</div>
                    <div class="text-subtitle-1">{{ formattedDates(edition.start_date, edition.end_date) }}</div>
                </v-col>
                <v-col cols="2">
                    <v-img rounded="xl" :src="flagSrc(edition.country)"/>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-toolbar color="indigo-accent-4" class="rounded-t-xl">
                        <v-tabs v-model="tab">
                            <v-tab value="overview">Overview</v-tab>
                            <v-tab value="results" v-if="edition.type_of_draw !== 'T'">Results</v-tab>
                            <v-tab value="group" v-if="edition.type_of_draw === 'T'">Group Stages</v-tab>
                            <v-tab value="draw" v-if="edition.type_of_draw !=='T'">Draw</v-tab>
                            <v-tab value="teamKO" v-if="edition.type_of_draw === 'T'">Knockout Stages</v-tab>
                        </v-tabs>
                    </v-toolbar>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-window v-model="tab">
                        <v-window-item value="overview">
                            <OverviewWindow v-if="edition.type_of_draw !== 'T'" :edition/>
                            <TeamOverview v-else-if="ties.length > 0 && edition.type_of_draw === 'T'" :edition />
                        </v-window-item>
                        <v-window-item value="results">
                            <ResultsWindow :edition :matches />
                        </v-window-item>
                        <v-window-item value="group">
                            <TeamGroups v-if="ties.length > 0" :ties />
                        </v-window-item>
                        <v-window-item value="draw">
                            <DrawWindow :edition :matches />
                        </v-window-item>
                        <v-window-item value="teamKO">
                            <TeamKO v-if="ties.length > 0" :ties />
                        </v-window-item>
                    </v-window>
                </v-col>
            </v-row>
        </v-container>
        <div v-else class="text-h3">Loading...</div>
    </v-sheet>
</template>