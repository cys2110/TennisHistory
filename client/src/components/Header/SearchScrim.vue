<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { useDisplay } from 'vuetify';
import SearchService from '@/services/SearchService';
import { encodeName, flagSrc, headshot } from '../utils';
import type { Player, Tournament } from '../interfaces';

const { smAndUp } = useDisplay()
const searchTerm: Ref<string> = ref('')
const tournamentResults: Ref<Tournament[]> = ref([])
const playerResults: Ref<Player[]> = ref([])

const submitSearch = () => {
    SearchService.search(searchTerm.value)
    .then(response => {
        tournamentResults.value = response.data.tournaments
        playerResults.value = response.data.players
    })
    .catch(e => console.log(e))
}
</script>

<template>
    <short-card
        class="mx-auto"
        :width="smAndUp ? '60%' : '100%'"
    >
        <!--Searchbar-->
        <v-card-actions>
            <v-text-field
                label="Search tournament or player"
                variant="outlined"
                clearable
                v-model="searchTerm"
                rounded
                full-width
                autofocus
                prepend-inner-icon="fas fa-magnifying-glass"
                @update:model-value="submitSearch"
            />
        </v-card-actions>
        <v-card-text>
            <v-list class="bg-transparent">
                <!--Tournament results-->
                <v-list-subheader class="text-lg">Tournaments</v-list-subheader>
                <v-list-item v-if="tournamentResults.length === 0">No results matching search</v-list-item>
                <v-list-item
                    v-else
                    v-for="result in tournamentResults"
                    :key="result.id"
                >
                    <router-link
                        class="hover-link"
                        :to="{name: 'Tournament', params: {id: result.id, name: encodeName(result.name)}}"
                        @click="$emit('close')"
                    >
                        {{ result.name }}
                    </router-link>
                </v-list-item>
                <!--Player results-->
                <v-list-subheader class="text-lg">Players</v-list-subheader>
                <v-list-item v-if="playerResults.length === 0">No results matching search</v-list-item>
                <v-list-item
                    v-else
                    v-for="result in playerResults"
                    :key="result.id"
                >
                    <router-link
                        class="flex items-center"
                        :to="{name: 'Player', params: {id: result.id, name: encodeName(result.full_name)}}"
                        @click="$emit('close')"
                    >
                        <div class="mx-1">
                            <flag-img
                                :src="flagSrc(result.country)"
                                width="2rem"
                            />
                        </div>
                        <div class="mx-1">
                            <v-avatar size="small">
                                <v-img :src="headshot(result.id)" :alt="result.full_name" />
                            </v-avatar>
                        </div>
                        <div class="mx-1 hover-link">{{ result.full_name }}</div>
                    </router-link>
                </v-list-item>
            </v-list>
        </v-card-text>
    </short-card>
</template>