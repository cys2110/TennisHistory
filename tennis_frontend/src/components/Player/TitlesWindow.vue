<script setup>
import EditionService from '@/services/EditionService';
import { onMounted, ref } from 'vue';
import { groupObjectsByKey } from '@/components/utils';
import { RouterLink } from 'vue-router';

const props = defineProps(['player'])
const finalsArray = ref([])
const titlesArray = ref([])
const finals = ref({})
const titles = ref({})
const selection = ref('Titles')
const items = ['Titles', 'Finals']

onMounted(() => {
    EditionService.getEditionsByPlayer(props.player.id)
    .then(response => {
        finalsArray.value = response.data.filter(edition => edition.finalist_id === props.player.id)
        const groupedFinals = groupObjectsByKey(finalsArray.value, 'year')
        finals.value = groupedFinals

        titlesArray.value = response.data.filter(edition => edition.winner_id === props.player.id)
        const groupedTitles = groupObjectsByKey(titlesArray.value, 'year')
        titles.value = groupedTitles
    })
    .catch(error => console.log(error))
})
</script>

<template>
    <v-container>
        <v-row>
            <v-col>
                <v-combobox variant="outlined" v-model="selection" :items="items" style="width: 10%;" density="compact"></v-combobox>
            </v-col>
        </v-row>
        <v-row v-if="selection === 'Titles'">
            <v-table v-if="titlesArray.length > 0" class="w-75 mx-auto rounded-xl">
                <thead>
                    <tr class="bg-indigo-accent-1">
                        <th class="font-weight-bold text-center">Year</th>
                        <th class="font-weight-bold text-center">No. of titles</th>
                        <th class="font-weight-bold text-center">Tournaments</th>
                        <th class="font-weight-bold text-center">Surface</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="year in titles">
                        <td class="text-center">{{ year[0].year }}</td>
                        <td class="text-center">{{ year.length }}</td>
                        <td class="text-center">
                            <div v-for="tournament in year">
                                <span v-if="tournament.sponsor_name">{{ tournament.sponsor_name }} | </span>
                                <span><RouterLink class="hover-link" :to="{name: 'Tournament', params: {id: tournament.TournamentId, name: tournament.Tournament.name}}">{{ tournament.Tournament.name }}</RouterLink></span>
                            </div>
                        </td>
                        <td class="text-center">
                            <div v-for="tournament in year">
                                <span>{{ tournament.environment }} {{ tournament.surface }}</span>
                                <span v-if="tournament.hard_type"> ({{ tournament.hard_type }})</span>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </v-table>
            <div v-else class="text-subtitle-1">No titles won</div>
        </v-row>
        <v-row v-if="selection === 'Finals'">
            <v-table v-if="finalsArray.length > 0" class="w-75 mx-auto rounded-xl">
                <thead>
                    <tr class="bg-indigo-accent-1">
                        <th class="font-weight-bold text-center">Year</th>
                        <th class="font-weight-bold text-center">No. of finals</th>
                        <th class="font-weight-bold text-center">Tournaments</th>
                        <th class="font-weight-bold text-center">Surface</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="year in finals">
                        <td class="text-center">{{ year[0].year }}</td>
                        <td class="text-center">{{ year.length }}</td>
                        <td class="text-center">
                            <div v-for="tournament in year">
                                <span v-if="tournament.sponsor_name">{{ tournament.sponsor_name }} | </span>
                                <span><RouterLink class="hover-link" :to="{name: 'Tournament', params: {id: tournament.TournamentId, name: tournament.Tournament.name}}">{{ tournament.Tournament.name }}</RouterLink></span>
                            </div>
                        </td>
                        <td class="text-center">
                            <div v-for="tournament in year">
                                <span>{{ tournament.environment }} {{ tournament.surface }}</span>
                                <span v-if="tournament.hard_type"> ({{ tournament.hard_type }})</span>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </v-table>
            <div v-else class="text-subtitle-1">No finals competed in</div>
        </v-row>
    </v-container>
</template>