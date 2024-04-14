<script setup>
import { categorySrc, flagSrc, formattedDates, environment, surface } from './utils';
import { RouterLink } from 'vue-router';

const props = defineProps(['edition'])
const currentDate = new Date()
const startDate = new Date(props.edition.start_date)

</script>

<template>
    <div class="wide-card">
        <div class="card-column" v-if="edition.category"><img :src="categorySrc(edition.category)" :alt="edition.category" class="filter" /></div>
        <div class="card-column">
            <div class="card-heading">
                <div class="wide-card-heading" v-if="edition.sponsor_name">{{ edition.sponsor_name }}</div>
                <div class="wide-card-heading"><RouterLink :to="{name: 'Tournament', params: {id: edition.tournament_id }}" class="hover-link">{{ edition.tournament_name }}</RouterLink></div>
                <div class="wide-card-subheading">{{ edition.city }} <img class="mini-flag" :src="flagSrc(edition.country)" :alt="edition.country" /> | {{ formattedDates(edition.start_date, edition.end_date) }}</div>
            </div>
        </div>
        <div class="right card-column">
            <div class="card-subcolumn" v-if="edition.surface">
                <div class="card-row">{{ environment(edition.environment) }} {{ surface(edition.surface) }}</div>
                <div class="card-row" v-if="edition.hard_type">({{ edition.hard_type }})</div>
            </div>
            <div class="buttons" v-if="currentDate > startDate">
                <div class="card-button">Overview</div>
                <div class="card-button">Results</div>
                <div class="card-button">Draw</div>
            </div>
        </div>
    </div>
</template>