<script setup>
import SearchService from '@/services/SearchService';
import { ref } from 'vue';
import { useDisplay } from 'vuetify';
import { flagSrc, headshot } from './utils';

const { smAndDown } = useDisplay()

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
    <short-card
        :width="smAndDown ? '100%' : '60%'"
        class="mx-auto"
    >
        <!--Searchbar-->
        <v-card-actions class="mx-2 mt-2">
            <v-text-field
                label="Search tournament or player"
                variant="outlined"
                clearable
                v-model="searchTerm"
                rounded
                full-width
                @update:model-value="submitSearch"
                autofocus
                prepend-inner-icon="fas fa-magnifying-glass"
            />
        </v-card-actions>
        <v-card-text>
            <v-list class="bg-transparent">
                <!--Tournament results-->
                <v-list-subheader class="text-h6">Tournaments</v-list-subheader>
                <v-list-item v-if="tournamentResults.length === 0">No results matching search</v-list-item>
                <v-list-item
                    v-else
                    v-for="result in tournamentResults"
                    :key="result.id"
                >
                    <router-link class="hover-link" :to="{name: 'Tournament', params: {id: result.id, name: result.name}}" @click="$emit('close')">{{ result.name }}</router-link>
                </v-list-item>

                <!--Player results-->
                <v-list-subheader class="text-h6">Players</v-list-subheader>
                <v-list-item v-if="playerResults.length === 0">No results matching search</v-list-item>
                <v-list-item
                    v-else
                    v-for="result in playerResults"
                    :key="result.id"
                >
                    <router-link
                        class="hover-link d-flex align-center"
                        :to="{name: 'Player', params: {id: result.id, name: result.full_name}}"
                        @click="$emit('close')"
                    >
                        <div class="mx-1"><flag-img :src="flagSrc(result.country)" width="2rem" /></div>
                        <div class="mx-1">
                            <v-avatar>
                                <v-img :src="headshot(result.id)" />
                            </v-avatar>
                        </div>
                        <div class="mx-1">{{ result.full_name }}</div>
                    </router-link>
                </v-list-item>
            </v-list>
        </v-card-text>
    </short-card>
</template>