<script setup lang="ts">
import { computed, onMounted, ref, type Ref } from 'vue';
import EditionService from '@/services/EditionService';
import { groupObjectsByKey } from '../utils';
import type { EditionByPlayer } from '../interfaces';

const props = defineProps(['id'])

const finals: Ref<{[key: number]: EditionByPlayer[]} | null> = ref(null)
const titles: Ref<{[key: number]: EditionByPlayer[]} | null> = ref(null)
const selection = ref('Titles')
const items = ['Titles', 'Finals']

const selectedArray = computed(() => {
    return selection.value === 'Titles' ? titles.value : finals.value
})

onMounted(() => {
    EditionService.getEditionsByPlayer(props.id)
    .then(response => {
        const finalsArray: EditionByPlayer[] = response.data.filter((edition: EditionByPlayer) => edition.finalist_id === props.id)
        const groupedFinals = groupObjectsByKey(finalsArray, 'year')
        finals.value = groupedFinals

        const titlesArray: EditionByPlayer[] = response.data.filter((edition: EditionByPlayer) => edition.winner_id === props.id)
        const groupedTitles = groupObjectsByKey(titlesArray, 'year')
        titles.value = groupedTitles
    })
    .catch(error => console.log(error))
})
</script>

<template>
    <v-container>
        <v-row>
            <v-col
                cols="12"
                sm="6"
                md="3"
            >
                <v-combobox
                    class="text-zinc-300"
                    variant="outlined"
                    v-model="selection"
                    :items="items"
                    density="compact"
                />
            </v-col>
        </v-row>
        <v-row>
            <v-table
                v-if="selection === 'Titles' && titles && Object.keys(titles).length !== 0 || selection === 'Finals' && finals && Object.keys(finals).length !== 0"
                class="text-zinc-300 bg-transparent mx-auto"
            >
                <thead>
                    <tr>
                        <th class="text-center">Year</th>
                        <th class="text-center">{{ selection === 'Titles' ? 'No. of titles' : 'No. of finals' }}</th>
                        <th>Tournaments</th>
                        <th>Surface</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="year in selectedArray"
                        :key="year[0].year"
                    >
                        <td class="text-center">{{ year[0].year }}</td>
                        <td class="text-center">{{ year.length }}</td>
                        <td class="text-nowrap">
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
                        <td class="text-nowrap">
                            <div v-for="tournament in year">
                                <span>{{ tournament.environment }} {{ tournament.surface }}</span>
                                <span v-if="tournament.hard_type"> ({{ tournament.hard_type }})</span>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </v-table>
            <div
                v-else
                class="text-zinc-400 mx-auto"
            >
                {{ selection === 'Titles' ? 'No titles won' : 'No finals won' }}
            </div>
        </v-row>
    </v-container>
</template>