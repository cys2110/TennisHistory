<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import SearchService from '@/services/SearchService';

const searchTerm = ref(null)
const tournamentResults = ref([])
const playerResults = ref([])

const submitSearch = () => {
    SearchService.search(searchTerm.value)
    .then(response => {
        tournamentResults.value = response.data.tournaments
        playerResults.value = response.data.players
    })
    .catch(error => console.log(error))
}
</script>

<template>
    <short-card width="60%" class="mx-auto">
        <v-card-actions class="mx-2 mt-2">
            <v-text-field
                label="Search tournament or player by last name"
                variant="outlined"
                clearable
                v-model="searchTerm"
                rounded
                full-width
                @update:model-value="submitSearch"
            ></v-text-field>
        </v-card-actions>
        <v-card-text>
            <v-list class="bg-transparent">
                <v-list-subheader prepend-icon="mdi:mdi-tennis">Tournaments</v-list-subheader>
                <v-list-item v-if="tournamentResults.length === 0">No results matching search</v-list-item>
                <v-list-item v-else v-for="result in tournamentResults" :key="result.id"><RouterLink class="hover-link" :to="{name: 'Tournament', params: {id: result.id, name: result.name}}" @click="$emit('close')" >{{ result.name }}</RouterLink></v-list-item>
                <v-list-subheader prepend-icon="fad fa-people-pants-simple">Players</v-list-subheader>
                <v-list-item v-if="playerResults.length === 0">No results matching search</v-list-item>
                <v-list-item v-else v-for="result in playerResults" :key="result.id"><RouterLink  @click="$emit('close')" class="hover-link" :to="{name: 'Player', params: {id: result.id, name: result.full_name}}"  >{{ result.full_name }}</RouterLink></v-list-item>
            </v-list>
        </v-card-text>
    </short-card>
</template>