<script setup>
import DrawCard from '@/components/Edition/DrawCard.vue';
import { ref } from 'vue';
import { groupObjectsByKey } from '../utils';

const props = defineProps(['edition', 'matches'])

const sortedMatches = props.matches.toSorted((a, b) => {
  return a.id - b.id
})

const groupedMatches = groupObjectsByKey(sortedMatches, 'round')
const selectedRound = ref(parseInt(props.edition.type_of_draw))

const rounds = Object.keys(groupedMatches).map(key => {
  let name
  if (isNaN(parseInt(key))) {
    name = key
  } else {
    name = `R${key}`
  }
  const string = key
  const value = 2 * groupedMatches[key].length
  return {name, string, value}
})
const sortedRounds = rounds.sort((a, b) => b.value - a.value)

</script>

<template>
  <v-container>
    <v-row>
      <v-col class="d-flex align-center justify-center">
        <v-btn-toggle v-model="selectedRound" color="indigo-accent-3" variant="elevated">
          <v-btn v-for="round in sortedRounds" :key="round.name" :value="round.value" rounded="circle">{{ round.name }}</v-btn>
      </v-btn-toggle>
      </v-col>
    </v-row>
    <v-row class="overflow-x-auto">
      <template v-for="round in sortedRounds" :key="round.name">
        <v-col cols="4" class="d-flex flex-column justify-space-around" v-if="selectedRound === round.value || selectedRound === round.value*2 || selectedRound === round.value*4" >
          <DrawCard v-for="match in groupedMatches[round.string]" :key="match.id" :match :edition />
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>