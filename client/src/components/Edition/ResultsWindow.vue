<script setup lang="ts">
import { ref } from 'vue';
import { groupObjectsByKey, round } from '../utils';
import type { EditionDetails, MatchScore } from '../interfaces';
import ResultCard from './ResultCard.vue';

const props = defineProps<{
    edition: EditionDetails,
    matches: MatchScore[],
    name: string,
    id: string
}>()

const groupedMatches = groupObjectsByKey(props.matches, 'round')
const sortedRounds = Object.keys(groupedMatches)
    .map(key => {
        const name = key
        const string = round(key)
        const value = 2 * groupedMatches[key].length
        return {name, string, value}
    })
    .sort((a, b) => b.value - a.value)

const tab = ref(sortedRounds[0].value)
</script>

<template>
    <v-tabs
        v-model="tab"
        show-arrows
    >
        <v-tab
            v-for="round in sortedRounds"
            :key="round.name"
            :value="round.value"
        >
            {{ round.string }}
        </v-tab>
    </v-tabs>
    <v-window
        v-model="tab"
        direction="vertical"
    >
        <v-window-item
            v-for="round in sortedRounds"
            :key="round.name"
            :value="round.value"
        >
            <div class="flex flex-wrap justify-center">
                <ResultCard
                    v-for="match in groupedMatches[round.name]"
                    :key="match.id"
                    :match
                    :edition
                    :name
                    :id
                />
            </div>
        </v-window-item>
    </v-window>
</template>