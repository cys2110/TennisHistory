<script setup lang="ts">
// import { ref } from 'vue';
// import DrawCard from './DrawCard.vue';
// import { groupObjectsByKey, round } from '../utils';
// import type { EditionDetails, MatchScore } from '../interfaces';

// const props = defineProps<{
//     edition: EditionDetails,
//     matches: MatchScore[],
//     name: string,
//     id: string
// }>()

// const sortedMatches = props.matches.sort((a, b) => {
//     return a.id - b.id
// })
// const groupedMatches = groupObjectsByKey(sortedMatches, 'round')
// const sortedRounds = Object.keys(groupedMatches)
//     .map(key => {
//         let name = key
//         if (isNaN(parseInt(key))) {
//             name = key
//         } else {
//             name = `R${key}`
//         }
//         const string = key
//         const value = 2 * groupedMatches[key].length
//         return {name, string, value}
//     })
//     .sort((a, b) => b.value - a.value)

// const selectedRound = ref(parseInt(props.edition.type_of_draw))
</script>

<template>
    <!-- <v-container>
        <v-row>
            <v-col class="text-center">
                <v-btn-toggle
                    v-model="selectedRound"
                    rounded="xl"
                >
                    <v-btn
                        v-for="round in sortedRounds"
                        :key="round.name"
                        :value="round.value"
                        class="bg-zinc-700"
                        size="small"
                        slim
                    >
                        {{ round.name }}
                    </v-btn>
                </v-btn-toggle>
            </v-col>
        </v-row>
        <v-row>
            <template
                v-for="round in sortedRounds"
                :key="round.name"
            >
                <v-col
                    v-if="selectedRound === round.value || selectedRound === round.value*2 || selectedRound === round.value*4"
                    class="d-flex flex-column justify-space-around"
                    cols="12"
                    md="6"
                    xl="4"
                >
                    <DrawCard
                        v-for="match in groupedMatches[round.string]"
                        :key="match.id"
                        :edition
                        :match
                        :name
                        :id
                    />
                </v-col>
            </template>
        </v-row>
    </v-container> -->
</template>