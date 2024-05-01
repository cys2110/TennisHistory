<script setup>
import TournamentService from '@/services/TournamentService';
import { onMounted, ref, computed } from 'vue';
import TournamentCard from '@/components/TournamentCard.vue';

const props = defineProps(['id'])
const tournament = ref()

const years = computed(() => {
    if (!tournament.value.end_year) {
        return `${tournament.value.start_year} - present`
    } else if (tournament.value.start_year === tournament.value.end_year) {
        return tournament.value.start_year
    } else {
        return tournament.value.start_year - tournament.value.end_year
    }
})

onMounted(() => {
    TournamentService.getTournamentById(props.id)
    .then(response => tournament.value = response.data)
    .catch(error => console.log(error))
})
</script>

<template>
    <view-sheet>
        <v-container v-if="tournament">
            <v-row>
                <v-col class="d-flex">
                    <div class="text-h4 text-sm-h3">{{ tournament.name }}</div> <a v-if="tournament.website" :href="tournament.website" target="_blank"><v-icon icon="fad fa-arrow-up-right-from-square"/></a>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <div class="text-subtitle-1">{{ years }}</div>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" sm="6" md="4">
                    <TournamentCard v-for="edition in tournament.Editions" :edition :key="edition.id" />
                </v-col>
            </v-row>
        </v-container>
        <div v-else class="text-h3">No data available yet</div>
    </view-sheet>
</template>