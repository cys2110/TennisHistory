<script setup>
import { categorySrc, formattedDates, flagSrc } from './utils';
import { RouterLink, useRouter } from 'vue-router';

const props = defineProps(['edition'])
const router = useRouter()

const currentDate = new Date()
const startDate = new Date(props.edition.start_date)

const navigate = () => {
    router.push({name: 'Edition', params: {name: props.edition.Tournament.name, id: props.edition.TournamentId, year: props.edition.year, editionId: props.edition.edition_no}})
}

</script>

<template>
    <v-card variant="outlined" class="my-5 mx-auto py-3 px-4 w-75" rounded="pill" color="indigo-accent-1">
        <v-container>
            <v-row class="align-center">
                <v-col cols="2"><v-img :src="categorySrc(edition.category)" class="filter" :alt="edition.category"></v-img></v-col>
                <v-col class="d-flex flex-column">
                    <div class="text-h5" v-if="edition.sponsor_name">{{ edition.sponsor_name }}</div>
                    <div class="text-h5"><RouterLink :to="{name: 'Tournament', params: {name: edition.Tournament.name, id: edition.TournamentId }}" class="hover-link">{{ edition.Tournament.name }}</RouterLink></div>
                    <div class="text-subtitle-2">{{ edition.city }} | {{ formattedDates(edition.start_date, edition.end_date) }} | {{ edition.environment }} {{ edition.surface }}<span v-if="edition.hard_type">{{ edition.hard_type }}</span></div>
                </v-col>
                <v-col cols="3" class="d-flex justify-space-evenly align-center">
                    <v-chip v-if="currentDate > startDate" variant="outlined" @click="navigate()">Results</v-chip>
                    <v-img rounded="lg" max-width="75" class="border-thin" :src="flagSrc(edition.country)" :alt="edition.country"></v-img>
                </v-col>
            </v-row>
        </v-container>
    </v-card>
</template>