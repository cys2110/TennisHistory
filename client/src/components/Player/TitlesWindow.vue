<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { groupObjectsByKey } from '../utils';
import EditionService from '@/services/EditionService';

const props = defineProps(['id'])

const finals = ref(null)
const titles = ref(null)
const selection = ref('Titles')
const items = ['Titles', 'Finals']

onMounted(() => {
    EditionService.getEditionsByPlayer(props.id)
    .then(response => {
        //@ts-ignore
        const finalsArray = response.data.filter(edition => edition.finalist_id === props.id)
        const groupedFinals = groupObjectsByKey(finalsArray, 'year')
        //@ts-ignore
        finals.value = groupedFinals

        //@ts-ignore
        const titlesArray = response.data.filter(edition => edition.winner_id === props.id)
        const groupedTitles = groupObjectsByKey(titlesArray, 'year')
        //@ts-ignore
        titles.value = groupedTitles
    })
    .catch(error => console.log(error))
})
</script>

<template>
    <v-container>
        <v-row>
            <v-col cols="2">
                <v-combobox
                    variant="outlined"
                    v-model="selection"
                    :items="items"
                    density="compact"
                />
            </v-col>
        </v-row>
        <v-row v-if="selection === 'Titles'">
            <v-table
                v-if="titles && Object.keys(titles).length !== 0"
            >
                <thead>
                    <tr>
                        <th>Year</th>
                        <th>No. of titles</th>
                        <th>Tournaments</th>
                        <th>Surface</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="year in titles" :key="year">
                        <td>{{ year[0].year }}</td>
                        <td>{{ year.length }}</td>
                        <td>
                            <div v-for="tournament in year">
                                <span v-if="tournament.sponsor_name">{{ tournament.sponsor_name }} | </span>
                                <span>
                                    <router-link
                                        class="hover-link"
                                        :to="{name: 'Tournament', params: {name: tournament.Tournament.name, id: tournament.Tournament.id}}"
                                    >
                                        {{ tournament.Tournament.name }}
                                    </router-link>
                                </span>
                            </div>
                        </td>
                        <td>
                            <div v-for="tournament in year">
                                <span>{{ tournament.environment }} {{ tournament.surface }}</span>
                                <span v-if="tournament.hard_type"> ({{ tournament.hard_type }})</span>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </v-table>
        </v-row>
        <v-row v-if="selection === 'Finals'"></v-row>
    </v-container>
</template>