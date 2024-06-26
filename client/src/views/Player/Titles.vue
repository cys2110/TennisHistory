<script setup lang="ts">
import { provideApolloClient, useQuery } from '@vue/apollo-composable';
import { computed, ref, watch, type Ref } from 'vue';
import apolloClient from '@/apollo';
import { getPlayerTitles } from '@/services/APICalls';
import type { TitlesAndFinals } from '@/components/interfaces';

provideApolloClient(apolloClient)

const props = defineProps(['id'])

const { query, variables } = getPlayerTitles(props.id)
const { result, loading, error } = useQuery(query, variables)

const results: Ref<TitlesAndFinals> = ref({titlesByYear: [], finalsByYear: []})
const selection = ref('Titles')
const items = ['Titles', 'Finals']

const selectedArray = computed(() => {
    return selection.value === 'Titles' ? results.value.titlesByYear : results.value.finalsByYear
})

watch(result, (newResult) => {
    if (newResult) {
        results.value = newResult.players[0]
    }
}, {immediate: true})

watch(error, (newError) => {
    if (newError) {
        console.error(newError)
    }
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
                v-if="selection === 'Titles' && results.titlesByYear.length > 0 || selection === 'Finals' && results.finalsByYear.length > 0"
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
                        :key="year.year"
                    >
                        <td class="text-center">{{ year.year }}</td>
                        <td class="text-center">{{ year.count }}</td>
                        <td class="text-nowrap">
                            <div v-for="event in year.events">
                                <span v-if="event.sponsor_name">{{ event.sponsor_name }} | </span>
                                <span>
                                    <router-link
                                        class="hover-link"
                                        :to="{name: 'Tournament', params: {name: event.tournament_name, id: event.tournament_id}}"
                                    >
                                        {{ event.tournament_name }}
                                    </router-link>
                                </span>
                            </div>
                        </td>
                        <td class="text-nowrap">
                            <div v-for="event in year.events">
                                <span>{{ event.environment }} {{ event.surface }}</span>
                                <span v-if="event.hard_type"> ({{ event.hard_type }})</span>
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