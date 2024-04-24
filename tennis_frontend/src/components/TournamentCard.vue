<script setup>
import { RouterLink } from 'vue-router';
import { headshot, flagSrc } from './utils';
import { computed, ref } from 'vue';

const props = defineProps(['edition'])
const display = ref(true)

const formatScore = (score) => {
  const parts = score.split(' ');
  const formattedParts = parts.map(part => {
    const match = part.match(/\((.*?)\)/);
    if (match) {
      const subscript = match[1];
      const base = part.replace(/\(.*?\)/, '');
      return `${base}<sup>${subscript}</sup>`;
    } else {
      return part;
    }
  });
  return formattedParts.join(' ');
}

const score = computed(() => formatScore(props.edition.final_score))
const endDate = new Date(props.edition.end_date)
const currentDate = new Date()

endDate < currentDate ? display.value = true : display.value = false

</script>

<template>
  <v-card variant="outlined" rounded="xl" color="indigo-accent-4">
    <v-container>
      <v-row>
        <v-col>
          <div class="text-h5 text-center"><RouterLink class="hover-link" :to="{name: 'EditionOverview', params: {editionId: edition.edition_no}}">{{ edition.year }}</RouterLink></div>
        </v-col>
      </v-row>
      <v-row class="align-center">
        <v-spacer></v-spacer>
        <v-col cols="1">
          <v-avatar><v-img v-if="edition.winner && edition.winner.headshot" :src="headshot(edition.winner_id)" :alt="edition.winner.full_name" :eager="true"></v-img></v-avatar>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="2">
          <v-img v-if="edition.winner" :src="flagSrc(edition.winner.country)" class="mini-flag" :alt="edition.winner.country"></v-img>
        </v-col>
        <v-col cols="6"><RouterLink v-if="edition.winner" class="hover-link" :to="{name: 'PlayerOverview', params: {id: edition.winner_id, name:edition.winner.full_name}}">{{ edition.winner.full_name }}</RouterLink></v-col>
        <v-spacer></v-spacer>
      </v-row>
      <v-row>
        <v-col class="text-center">d.</v-col>
      </v-row>
      <v-row>
        <v-spacer></v-spacer>
        <v-col cols="1">
          <v-avatar>
            <v-img v-if="edition.finalist && edition.finalist.headshot" :src="headshot(edition.finalist_id)" :alt="edition.finalist.full_name"></v-img>
          </v-avatar>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="2">
          <v-img v-if="edition.finalist" :src="flagSrc(edition.finalist.country)" class="mini-flag" :alt="edition.finalist.country"></v-img>
        </v-col>
        <v-col cols="6"><RouterLink v-if="edition.finalist" class="hover-link" :to="{name: 'PlayerOverview', params: {id: edition.finalist_id, name:edition.finalist.full_name}}">{{ edition.finalist.full_name }}</RouterLink></v-col>
        <v-spacer></v-spacer>
      </v-row>
      <v-row>
        <v-col class="text-center">
          <div v-if="edition.winner">{{ score }}</div>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>