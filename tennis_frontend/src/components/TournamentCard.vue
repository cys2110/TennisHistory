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
  <v-card variant="outlined" rounded="xl" color="indigo-accent-1">
    <v-container>
      <v-row>
        <v-col>
          <div class="text-h5 text-center"><RouterLink class="hover-link" :to="{name: 'Edition', params: {editionId: edition.edition_no, year: edition.year}}">{{ edition.year }}</RouterLink></div>
        </v-col>
      </v-row>
      <v-row class="align-center">
        <v-col class="d-flex justify-space-evenly align-center">
          <v-avatar size="x-large">
            <v-img v-if="edition.winner && edition.winner.headshot" :src="headshot(edition.winner_id)" :alt="edition.winner.full_name" :eager="true"></v-img>
          </v-avatar>
          <v-img v-if="edition.winner" :src="flagSrc(edition.winner.country)" rounded="lg" max-width="50" :alt="edition.winner.country"></v-img>
          <div class="text-subtitle-1"><RouterLink v-if="edition.winner" class="hover-link" :to="{name: 'Player', params: {id: edition.winner_id, name:edition.winner.full_name}}">{{ edition.winner.full_name }}</RouterLink></div>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="text-center">d.</v-col>
      </v-row>
      <v-row>
        <v-col class="d-flex justify-space-evenly align-center">
          <v-avatar size="x-large" variant="outlined">
            <v-img v-if="edition.finalist && edition.finalist.headshot" :src="headshot(edition.finalist_id)" :alt="edition.finalist.full_name"></v-img>
          </v-avatar>
          <v-img v-if="edition.finalist" :src="flagSrc(edition.finalist.country)" max-width="50" rounded="lg" :alt="edition.finalist.country"></v-img>
          <div class="text-subtitle-1">
            <RouterLink v-if="edition.finalist" class="hover-link" :to="{name: 'Player', params: {id: edition.finalist_id, name:edition.finalist.full_name}}">{{ edition.finalist.full_name }}</RouterLink>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="text-center">
          <div v-if="edition.winner" class="text-h6">{{ score }}</div>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>