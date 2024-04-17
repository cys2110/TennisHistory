<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faCircleXmark } from '@fortawesome/pro-duotone-svg-icons';
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import SearchService from '@/services/SearchService';

const emits = defineEmits(['closeSearch'])
const searchTerm = ref(null)
const submittedSearch = ref(false)
const tournamentResults = ref([])
const playerResults = ref([])

const submitSearch = () => {
    event.preventDefault()
    SearchService.search(searchTerm.value)
    .then(response => {
        submittedSearch.value = true
        tournamentResults.value = response.data.tournaments
        playerResults.value = response.data.players
    })
    .catch(error => console.log(error))
}

const closeSearch = () => {
    emits('closeSearch')
}
</script>

<template>
    <div class="search-wrapper">
        <FontAwesomeIcon class="search-icon" :icon="faCircleXmark" @click="closeSearch" />
        <input type="text" v-model="searchTerm" placeholder="Search player or tournament" @change="submitSearch" />
        <div class="search-results-container" v-if="submittedSearch">
            <div class="results">
                <h1>Tournaments</h1>
                <div v-if="tournamentResults.length === 0">No results matching search</div>
                <div v-else v-for="result in tournamentResults" :key="result.id"><RouterLink class="hover-link" :to="{name: 'Tournament', params: {id: result.id, name: result.name}}">{{ result.name }}</RouterLink></div>
            </div>
            <div class="results">
                <h1>Players</h1>
                <div v-if="playerResults.length === 0">No results matching search</div>
                <div v-else v-for="result in playerResults" :key="result.id"><RouterLink class="hover-link" :to="{name: 'PlayerOverview', params: {name: result.full_name, id: result.id}}">{{ result.full_name }}</RouterLink></div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.search-wrapper {
    width: 60vw;
    height: 60vh;
    display: flex;
    flex-flow: column nowrap;
    align-items: flex-end;
}

.search-icon {
    font-size: x-large;
    cursor: pointer;
}

input {
    width: 100%;
    margin-top: 1rem;
    align-self: center;
    height: 2.5rem;
    border-radius: 20px;
    padding-left: 2%;
    border: 1.5px solid var(--blue-border);
    outline: 1px solid var(--blue-border);
    background-color: var(--color-background);
    color: var(--color-text)
}

.search-results-container {
    align-self: flex-start;
    background-color: var(--color-background);
    width: 100%;
    margin-top: 1rem;
    border: 1.5px solid var(--blue-border);
    border-radius: 20px;
    padding: 1rem
}
</style>