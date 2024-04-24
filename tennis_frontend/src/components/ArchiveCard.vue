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
    <v-card variant="outlined" class="my-5 py-3 px-4" rounded="pill" color="indigo-accent-4">
        <v-container>
            <v-row class="align-center">
                <v-col cols="2">
                    <v-img :src="categorySrc(edition.category)" class="filter" :alt="edition.category"></v-img>
                </v-col>
                <v-col class="d-flex flex-column">
                    <div class="text-h5" v-if="edition.sponsor_name">{{ edition.sponsor_name }}</div>
                    <div class="text-h5"><RouterLink :to="{name: 'Tournament', params: {id: edition.TournamentId, name: edition.Tournament.name }}" class="hover-link">{{ edition.Tournament.name }}</RouterLink></div>
                    <div class="text-subtitle-2">{{ edition.city }} <img class="mini-flag" :src="flagSrc(edition.country)" :alt="edition.country" /> | {{ formattedDates(edition.start_date, edition.end_date) }} | {{ edition.environment }} {{ edition.surface }}<span v-if="edition.hard_type"> ({{ edition.hard_type }})</span></div>
                </v-col>
                <v-col cols="3">
                    <v-chip-group variant="outlined" v-if="currentDate > startDate">
                        <v-chip @click="navigate('Edition')">Overview</v-chip>
                    </v-chip-group>
                </v-col>
            </v-row>
        </v-container>
    </v-card>
</template>