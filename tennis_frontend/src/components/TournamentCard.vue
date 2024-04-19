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
    <div class="card-container">
        <div class="centred card-heading"><RouterLink class="hover-link" :to="{name: 'EditionOverview', params: {editionId: edition.edition_no}}">{{ edition.year }}</RouterLink></div>
        <div class="card-component">
            <div class="card-detail"><img v-if="edition.winner && edition.winner.headshot" :src="headshot(edition.winner_id)" class="headshot" :alt="edition.winner.full_name" /></div>
            <div class="card-detail"><img v-if="edition.winner" :src="flagSrc(edition.winner.country)" class="mini-flag" :alt="edition.winner.country" /></div>
            <div class="card-detail"><RouterLink v-if="edition.winner" class="hover-link" :to="{name: 'PlayerOverview', params: {id: edition.winner_id, name:edition.winner.full_name}}">{{ edition.winner.full_name }}</RouterLink></div>
        </div>
        <div class="centred card-component" v-if="edition.winner">d.</div>
        <div class="card-component">
            <div class="card-detail"><img v-if="edition.finalist && edition.finalist.headshot" :src="headshot(edition.finalist_id)" class="headshot" :alt="edition.finalist.full_name" /></div>
            <div class="card-detail"><img v-if="edition.finalist" :src="flagSrc(edition.finalist.country)" class="mini-flag" :alt="edition.finalist.country" /></div>
            <div class="card-detail"><RouterLink v-if="edition.finalist" class="hover-link" :to="{name: 'PlayerOverview', params: {id: edition.finalist_id, name:edition.finalist.full_name}}">{{ edition.finalist.full_name }}</RouterLink></div>
        </div>
        <div class="centred card-component" v-if="edition.winner">{{ score }}</div>
    </div>
</template>

<style scoped>
.card-container {
  display: flex;
  flex-direction: column;
  border: 2px solid var(--blue-border);
  border-radius: 1rem;
  padding: 1rem;
  margin: 1.5rem;
  width: 40%;
}

.card-heading {
  font-size: xx-large
}

.card-detail {
  margin-left: 0.25rem;
  margin-right: 0.25rem;
}

.centred {
  align-self: center;
}
</style>