<script setup>
import { RouterLink } from 'vue-router';
import { headshot, flagSrc } from './utils';
import { ref } from 'vue';

const props = defineProps(['edition'])
const display = ref(true)

const formatScore = (score) => {
  return score.replaceAll('(', '<sup>').replaceAll(')', '</sup>')
}

const endDate = new Date(props.edition.end_date)
const currentDate = new Date()

endDate < currentDate ? display.value = true : display.value = false

</script>

<template>
  <short-card>
    <v-container>
      <v-row>
        <v-col>
          <div class="text-h5 text-center">
            <RouterLink
              class="hover-link"
              :to="{name: 'Edition', params: {editionId: edition.edition_no, year: edition.year}}"
            >
              {{ edition.year }}
            </RouterLink>
          </div>
        </v-col>
      </v-row>
      <v-row class="align-center">
        <v-col class="d-flex justify-space-evenly align-center">
          <v-avatar
            size="x-large"
          >
            <v-img
              v-if="edition.winner?.headshot"
              :src="headshot(edition.winner_id)"
              :alt="edition.winner.full_name" 
            />
          </v-avatar>
          <flag-img
            v-if="edition.winner"
            :src="flagSrc(edition.winner.country)"
            max-width="50"
            :alt="edition.winner.country"
          />
          <div class="text-subtitle-1">
            <RouterLink
              v-if="edition.winner"
              class="hover-link"
              :to="{name: 'Player', params: {id: edition.winner_id, name:edition.winner.full_name}}"
            >
              {{ edition.winner.full_name }}
            </RouterLink>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="text-center">d.</v-col>
      </v-row>
      <v-row>
        <v-col class="d-flex justify-space-evenly align-center">
          <v-avatar
            size="x-large"
          >
            <v-img
              v-if="edition.finalist?.headshot"
              :src="headshot(edition.finalist_id)"
              :alt="edition.finalist.full_name"
            />
          </v-avatar>
          <flag-img
            v-if="edition.finalist"
            :src="flagSrc(edition.finalist.country)"
            max-width="50"
            :alt="edition.finalist.country"
          />
          <div class="text-subtitle-1">
            <RouterLink
              v-if="edition.finalist"
              class="hover-link"
              :to="{name: 'Player', params: {id: edition.finalist_id, name:edition.finalist.full_name}}"
            >
                {{ edition.finalist.full_name }}
            </RouterLink>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="text-center">
          <div v-if="edition.winner" class="text-h6" v-html="formatScore(edition.final_score)" />
        </v-col>
      </v-row>
    </v-container>
  </short-card>
</template>