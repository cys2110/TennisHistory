<script setup>
import { categorySrc, formattedDates, flagSrc, environment, surface } from './utils';
import { RouterLink, useRouter } from 'vue-router';

const props = defineProps(['edition'])
const router = useRouter()

const currentDate = new Date()
const startDate = new Date(props.edition.start_date)

const navigate = (slug) => {
    router.push({name: slug, params: {name: props.edition.tournament_name, id: props.edition.tournament_id, editionId: props.edition.id}})
}

</script>

<template>
    <div class="wide-card">
        <div class="card-column"><img v-if="edition.category !== 'T' && edition.category !== 'F'" :src="categorySrc(edition.category)" class="filter" alt="edition.category" /></div>
        <div class="card-column">
            <div class="wide-card-heading" v-if="edition.sponsor_name">{{ edition.sponsor_name }}</div>
            <div class="wide-card-heading"><RouterLink :to="{name: 'Tournament', params: {name: edition.tournament_name, id: edition.tournament_id }}" class="hover-link">{{ edition.tournament_name }}</RouterLink></div>
            <div class="wide-card-subheading">{{ edition.city }} | {{ formattedDates(edition.start_date, edition.end_date) }} | {{ environment(edition.environment) }} {{ surface(edition.surface) }}<span v-if="edition.hard_type">{{ edition.hard_type }}</span></div>
        </div>
        <div class="right card-column">
            <div class="buttons" v-if="currentDate > startDate">
                <div class="card-button" @click="navigate('EditionOverview')">Overview</div>
                <div class="card-button" @click="navigate('Results')">Results</div>
                <div class="card-button" @click="navigate('Draw')">Draw</div>
            </div>
            <div class="wide-card-flag">
                <img class="card-flag" :src="flagSrc(edition.country)" :alt="edition.country" />
            </div>
        </div>
    </div>
</template>