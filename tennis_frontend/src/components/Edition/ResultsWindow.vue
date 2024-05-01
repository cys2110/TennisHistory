<script setup>
import ResultCard from '@/components/Edition/ResultCard.vue';
import { ref } from 'vue';
import { groupObjectsByKey, round } from '../utils';

const props = defineProps(['edition', 'matches'])

const groupedMatches = groupObjectsByKey(props.matches, 'round')

const rounds = Object.keys(groupedMatches).map(key => {
  const name = key
  const string = round(key)
  const value = 2 * groupedMatches[key].length
  return {name, string, value}
})
const sortedRounds = rounds.sort((a, b) => b.value - a.value)

const tab = ref(null)
</script>

<template>
        <v-tabs v-model="tab">
            <v-tab v-for="round in sortedRounds" :key="round.name" :value="round.value">{{ round.string }}</v-tab>
        </v-tabs>
        <v-window v-model="tab" class="mt-5" direction="vertical">
            <v-window-item v-for="round in sortedRounds" :key="round.name" :value="round.value">
                <div class="d-flex flex-row flex-wrap">
                    <ResultCard v-for="match in groupedMatches[round.name]" :key="match.id" :match :edition />
                </div>
            </v-window-item>
        </v-window>
</template>