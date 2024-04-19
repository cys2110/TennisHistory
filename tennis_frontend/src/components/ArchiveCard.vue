<script setup>
import { categorySrc, flagSrc, formattedDates } from './utils';
import { RouterLink, useRouter } from 'vue-router';

const props = defineProps(['edition'])
const router = useRouter()
const currentDate = new Date()
const startDate = new Date(props.edition.start_date)

const navigate = (slug) => {
    router.push({name: slug, params: {id: props.edition.TournamentId, name: props.edition.Tournament.name, editionId: props.edition.edition_no}})
}

</script>

<template>
    <div class="wide-card">
        <div class="card-column" v-if="edition.category"><img :src="categorySrc(edition.category)" :alt="edition.category" class="filter" /></div>
        <div class="card-column">
            <div class="card-heading">
                <div class="wide-card-heading" v-if="edition.sponsor_name">{{ edition.sponsor_name }}</div>
                <div class="wide-card-heading"><RouterLink :to="{name: 'Tournament', params: {id: edition.TournamentId, name: edition.Tournament.name }}" class="hover-link">{{ edition.Tournament.name }}</RouterLink></div>
                <div class="wide-card-subheading">{{ edition.city }} <img class="mini-flag" :src="flagSrc(edition.country)" :alt="edition.country" /> | {{ formattedDates(edition.start_date, edition.end_date) }} | {{ edition.environment }} {{ edition.surface }}<span v-if="edition.hard_type"> ({{ edition.hard_type }})</span></div>
            </div>
        </div>
        <div class="right card-column">
            <div class="buttons" v-if="currentDate > startDate">
                <div class="card-button" @click="navigate('EditionOverview')">Overview</div>
                <div class="card-button" @click="navigate('Results')">Results</div>
                <div class="card-button" @click="navigate('Draw')">Draw</div>
            </div>
        </div>
    </div>
</template>