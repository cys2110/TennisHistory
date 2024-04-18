<script setup>
import EditionService from '@/services/EditionService';
import { onMounted, ref } from 'vue';
import { groupObjectsByKey, surface, environment, hardType } from '@/components/utils';
import { RouterLink } from 'vue-router';

const props = defineProps(['player'])
const finalsArray = ref([])
const titlesArray = ref([])
const finals = ref({})
const titles = ref({})
const selection = ref('Titles')

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
    <main>
        <div class="dropdown">
            <select v-model="selection" class="dropdown-selection">
                <option value="Titles">Titles</option>
                <option value="Finals">Finals</option>
            </select>
        </div>
        <div v-if="selection === 'Titles'">
            <table v-if="titlesArray.length > 0">
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
                                <span><RouterLink class="hover-link" :to="{name: 'Tournament', params: {id: tournament.tournament_id, name: tournament.tournament_name}}">{{ tournament.tournament_name }}</RouterLink></span>
                            </div>
                        </td>
                        <td class="column">
                            <div v-for="tournament in year">
                                <span>{{ environment(tournament.environment) }} {{ surface(tournament.surface) }}</span>
                                <span v-if="tournament.hard_type"> ({{ hardType(tournament.hard_type) }})</span>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div v-else>None</div>
        </div>
        <div v-if="selection === 'Finals'">
            <table v-if="finalsArray.length > 0">
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
                                <span v-if="tournament.hard_type"> ({{ hardType(tournament.hard_type) }})</span>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div v-else>None</div>
        </div>
    </main>
</template>

<style scoped>
main {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
}

.dropdown {
    margin-left: auto;
}

.dropdown-selection {
    background-color: transparent;
    color: var(--color-text);
    padding: 0.25rem;
    border-radius: 1rem;
    border: 2px solid var(--blue-border);
}
</style>