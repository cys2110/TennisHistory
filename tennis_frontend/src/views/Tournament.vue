<script setup>
import TournamentService from '@/services/TournamentService';
import { onMounted, ref, computed } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/pro-duotone-svg-icons';
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
    <main v-if="tournament">
        <div class="view-heading">
            <h1>{{ tournament.name }}</h1> <a v-if="tournament.website" :href="tournament.website" target="_blank"><FontAwesomeIcon :icon="faArrowUpRightFromSquare" /></a>
        </div>
        <div class="view-subheading">{{ years }}</div>
        <div class="view-cards">
            <TournamentCard v-for="edition in tournament.Editions" :edition="edition" :key="edition.id" />
        </div>
    </main>
    <div v-else class="loading">Loading</div>
</template>

<style scoped>
.view-heading, .viewcards {
    display: flex;
    flex-direction: row
}

h1 {
    margin-right: 0.5rem;
}
</style>