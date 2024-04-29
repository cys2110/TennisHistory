<script setup>
import { ref } from 'vue';
import { groupObjectsByKey, flagSrc } from '../utils';
import TeamMatches from './TeamMatches.vue';

const props = defineProps(['ties'])

const groupTies = ref([])
const groupedTies = ref(null)

for (let i=0; i< props.ties.length; i++) {
    if (props.ties[i].round !== 'QF' && props.ties[i].round !== 'SF' && props.ties[i].round !== 'F') {
        groupTies.value.push(props.ties[i])
    }
}

groupedTies.value = groupObjectsByKey(groupTies.value, 'round')

const score = (match, wtaMatches) => {
    let win = 0
    if (match[0].winner_id === match[0].p1) {
        win++
    }
    if (wtaMatches[0].winner === 'wta1') {
        win++
    }
    if (wtaMatches[1].winner === 'wta1') {
        win ++
    }
    return win
}
</script>

<template>
    <v-container>
        <v-row>
            <v-col cols="4" v-for="group in groupedTies" :key="group[0].round">
                <v-card class="mx-3 py-3" variant="elevated" color="indigo-darken-4" rounded="xl">
                    <v-card-title class="text-h5 text-center">{{ group[0].round }}</v-card-title>
                    <v-card-subtitle class="text-center">{{ group[0].venue }}, {{ group[0].city }}</v-card-subtitle>
                        <div v-for="tie in group" :key="tie.id">
                            <v-card-text>
                            <div class="d-flex justify-space-evenly">
                                <div>
                                    <v-img
                                        :src="flagSrc(tie.country1)"
                                        :alt="tie.country1"
                                        width="100"
                                        rounded="lg"
                                    />
                                </div>
                                <div class="d-flex flex-nowrap align-center">
                                    <span class="text-h6" :class="{'font-weight-bold': score(tie.MatchScores, tie.NonCounts) > 1}">{{ score(tie.MatchScores, tie.NonCounts) }}</span>
                                    <span class="text-h6">-</span>
                                    <span class="text-h6" :class="{'font-weight-bold': score(tie.MatchScores, tie.NonCounts) <= 1}">{{ 3 - score(tie.MatchScores, tie.NonCounts) }}</span>
                                </div>
                                <div>
                                    <v-img
                                        :src="flagSrc(tie.country2)"
                                        :alt="tie.country2"
                                        width="100"
                                        rounded="lg"
                                    />
                                </div>
                            </div>
                        </v-card-text>
                        <v-card-actions>
                            <v-chip class="mx-auto">Matches
                                <v-dialog activator="parent" transition="dialog-bottom-transition">
                                    <TeamMatches :match="tie.MatchScores[0]" :wta="tie.NonCounts" :country1="tie.country1" :country2="tie.country2" />
                                </v-dialog>
                            </v-chip>
                        </v-card-actions>
                    </div>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>