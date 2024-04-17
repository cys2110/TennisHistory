<script setup>
import { categorySrc, formattedDates, flagSrc } from './utils';
import { RouterLink } from 'vue-router';

const props = defineProps(['edition'])

const currentDate = new Date()
const startDate = new Date(props.edition.start_date)

</script>

<template>
    <div class="wide-card">
        <div class="card-column" v-if="edition.category"><img :src="categorySrc(edition.category)" class="filter" alt="edition.category" /></div>
        <div class="card-column">
            <div class="wide-card-heading" v-if="edition.sponsor_name">{{ edition.sponsor_name }}</div>
            <div class="wide-card-heading"><RouterLink :to="{name: 'Tournament', params: {name: edition.tournament_name, id: edition.tournament_id }}" class="hover-link">{{ edition.tournament_name }}</RouterLink></div>
            <div class="wide-card-subheading">{{ edition.city }} | {{ formattedDates(edition.start_date, edition.end_date) }}</div>
        </div>
        <div class="right card-column">
            <div class="buttons" v-if="currentDate > startDate">
                <div class="card-button">Overview</div>
                <div class="card-button">Results</div>
                <div class="card-button">Draw</div>
            </div>
            <div class="wide-card-flag">
                <img class="card-flag" :src="flagSrc(edition.country)" :alt="edition.country" />
            </div>
        </div>
    </div>
</template>