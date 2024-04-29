<script setup>
import TeamMatches from './TeamMatches.vue';
import { flagSrc } from '../utils';

const props = defineProps(['tie'])

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
    <v-card variant="elevated" color="indigo-darken-4" rounded="xl" class="my-3">
        <v-container>
            <v-row>
                <v-col cols="10">
                    <v-img
                        :src="flagSrc(tie.country1)"
                        :alt="tie.country1"
                        rounded="lg"
                        width="150"
                    />
                </v-col>
                <v-col class="my-auto" :class="{'font-weight-bold': score(tie.MatchScores, tie.NonCounts) > 1}">{{ score(tie.MatchScores, tie.NonCounts) }}</v-col>
            </v-row>
            <v-row>
                <v-col cols="10">
                    <v-img
                        :src="flagSrc(tie.country2)"
                        :alt="tie.country2"
                        rounded="lg"
                        width="150"
                    />
                </v-col>
                <v-col class="my-auto" :class="{'font-weight-bold': score(tie.MatchScores, tie.NonCounts) <= 1}">{{ 3 - score(tie.MatchScores, tie.NonCounts) }}</v-col>
            </v-row>
        </v-container>
        <v-card-actions>
            <v-chip class="mx-auto">
                Matches
                <v-dialog activator="parent" transition="dialog-bottom-transition">
                    <TeamMatches :match="tie.MatchScores[0]" :wta="tie.NonCounts" :country1="tie.country1" :country2="tie.country2" />
                </v-dialog>
            </v-chip>
        </v-card-actions>
    </v-card>
</template>