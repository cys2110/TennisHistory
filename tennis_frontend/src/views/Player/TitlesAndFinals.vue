<script setup>
import EditionService from '@/services/EditionService';
import { onMounted, ref } from 'vue';
import { groupObjectsByKey, surface, environment } from '@/components/utils';

const props = defineProps(['player'])
const finals = ref({})
const titles = ref({})
const selection = ref('Titles')

onMounted(() => {
    EditionService.getEditionsByPlayer(props.player.id)
    .then(response => {
        const finalsArray = response.data.filter(edition => edition.finalist_id === props.player.id)
        const groupedFinals = groupObjectsByKey(finalsArray, 'year')
        finals.value = groupedFinals
        console.log(finals.value)

        const titlesArray = response.data.filter(edition => edition.winner_id === props.player.id)
        const groupedTitles = groupObjectsByKey(titlesArray, 'year')
        titles.value = groupedTitles
    })
    .catch(error => console.log(error))
})
</script>

<template>
    <main>
        <div class="dropdown">
            <select v-model="selection" class="dropdown-selection">
                <option value="Titles">Titles</option>
                <option value="Finals">Finals</option>
            </select>
        </div>
        <div v-if="selection === 'Titles'">
            <table v-if="titles">
                <thead>
                    <tr>
                        <th>Year</th>
                        <th>No. of titles</th>
                        <th>Tournaments</th>
                        <th>Surface</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="year in titles">
                        <td>{{ year[0].year }}</td>
                        <td>{{ year.length }}</td>
                        <td class="column">
                            <div v-for="tournament in year">
                                <span v-if="tournament.sponsor_name">{{ tournament.sponsor_name }} | </span>
                                <span>{{ tournament.tournament_name }}</span>
                            </div>
                        </td>
                        <td class="column">
                            <div v-for="tournament in year">
                                <span>{{ environment(tournament.environment) }} {{ surface(tournament.surface) }}</span>
                                <span v-if="tournament.hard_type">({{ tournament.hard_type }})</span>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div v-else>None</div>
        </div>
        <div v-if="selection === 'Finals'">
            <table v-if="finals">
                <thead>
                    <tr>
                        <th>Year</th>
                        <th>No. of finals</th>
                        <th>Tournaments</th>
                        <th>Surface</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="year in finals">
                        <td>{{ year[0].year }}</td>
                        <td>{{ year.length }}</td>
                        <td class="column">
                            <div v-for="tournament in year">
                                <span v-if="tournament.sponsor_name">{{ tournament.sponsor_name }} | </span>
                                <span>{{ tournament.tournament_name }}</span>
                            </div>
                        </td>
                        <td class="column">
                            <div v-for="tournament in year">
                                <span>{{ environment(tournament.environment) }} {{ surface(tournament.surface) }}</span>
                                <span v-if="tournament.hard_type">({{ tournament.hard_type }})</span>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div v-else>None</div>
        </div>
    </main>
</template>