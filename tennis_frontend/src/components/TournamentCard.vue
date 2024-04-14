<script setup>
import { RouterLink } from 'vue-router';
import { headshot, flagSrc } from './utils';
import { computed } from 'vue';

const props = defineProps(['edition'])

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
</script>

<template>
    <div class="card-container">
        <div class="card-heading">{{ edition.year }}</div>
        <div class="card-component">
            <div class="card-detail"><img v-if="edition.winner && edition.winner_headshot" :src="headshot(edition.winner_id)" class="headshot" :alt="edition.winner_name" /></div>
            <div class="card-detail"><img v-if="edition.winner" :src="flagSrc(edition.winner_country)" class="mini-flag" :alt="edition.winner_country" /></div>
            <div class="card-detail">{{ edition.winner_name }}</div>
        </div>
        <div class="card-component" v-if="edition.winner">d.</div>
        <div class="card-component">
            <div class="card-detail"><img v-if="edition.finalist && edition.finalist_headshot" :src="headshot(edition.finalist_id)" class="headshot" :alt="edition.finalist_name" /></div>
            <div class="card-detail"><img v-if="edition.finalist" :src="flagSrc(edition.finalist_country)" class="mini-flag" :alt="finalist_country" /></div>
            <div class="card-detail">{{ edition.finalist_name }}</div>
        </div>
        <div class="card-component" v-if="edition.winner">{{ score }}</div>
    </div>
</template>