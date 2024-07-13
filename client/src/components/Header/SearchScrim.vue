<script setup lang="ts">
import { ref, type Ref, watch, watchEffect } from 'vue';
import { useDisplay } from 'vuetify';
import apolloClient from '@/apollo';
import { provideApolloClient, useQuery } from '@vue/apollo-composable';
import { getSearch } from '@/services/SearchService';
import type { Player, Tournament } from '@/utils/interfaces';
import { encodeName, flag, headshot } from '@/utils/functions';

provideApolloClient(apolloClient)
const { smAndUp } = useDisplay()

const searchTerm: Ref<string> = ref('')
const tournamentResults: Ref<Tournament[]> = ref([])
const playerResults: Ref<Player[]> = ref([])

const updateSearch = () => {
    const { query, variables } = getSearch(searchTerm.value)
    const { result, loading, error} = useQuery(query, variables)

    watch(result, (newResult) => {
        if (newResult) {
            tournamentResults.value = newResult.tournaments
            playerResults.value = newResult.searchPlayers
        }
    }, {immediate: true})

    watch(error, (newError) => {
        if (newError) {
            console.error(newError)
        }
    })
}

watchEffect(() => {
    updateSearch()
})
</script>

<template>
    <v-card
        class="mx-auto bg-indigo-800"
        variant="text"
        :width="smAndUp ? '60%' : '100%'"
        rounded="xl"
    >
        <v-card-actions
            class="mt-4 mx-1"
        >
            <v-text-field
                label="Search tournament or player"
                variant="outlined"
                clearable
                v-model="searchTerm"
                rounded
                full-width
                autofocus
                prepend-inner-icon="fas fa-magnifying-glass"
            />
        </v-card-actions>
        <v-card-text>
            <v-list
                class="bg-transparent"
            >
                <v-list-subheader
                    class="text-lg"
                >
                    Tournaments
                </v-list-subheader>
                <v-list-item
                    v-if="tournamentResults.length === 0"
                >
                    No results matching search
                </v-list-item>
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
                <v-list-subheader
                    class="text-lg"
                >
                    Players
                </v-list-subheader>
                <v-list-item
                    v-if="playerResults.length === 0"
                >
                    No results matching search
                </v-list-item>
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
                        <div
                            class="mx-1"
                        >
                            <flag-img
                                v-if="result.country"
                                :src="flag(result.country.id)"
                                :alt="result.country.name"
                                width="2rem"
                            />
                        </div>
                        <div
                            class="mx-1"
                        >
                            <v-avatar
                                size="small"
                            >
                                <v-img
                                    :src="headshot(result.id)"
                                    :alt="result.full_name"
                                />
                            </v-avatar>
                        </div>
                        <div
                            class="mx-1 hover-link"
                        >
                            {{ result.full_name }}
                        </div>
                    </router-link>
                </v-list-item>
            </v-list>
        </v-card-text>
    </v-card>
</template>