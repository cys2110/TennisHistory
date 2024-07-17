<script setup lang="ts">
import type { Activity } from '@/utils/interfaces';
import { category, encodeName, formattedDates, formatCurrency } from '@/utils/functions';
import MatchRow from './MatchRow.vue';

const props = defineProps<{
    id: string
    name: string
    event: Activity
}>()
</script>

<template>
    <v-card
        class="my-5 text-zinc-300 bg-indigo-900"
        variant="text"
        rounded="xl"
    >
        <v-container>
            <v-row>
                <v-col
                    class="flex items-center ml-5"
                    cols="2"
                >
                    <v-img
                        v-if="event.node.category"
                        :src="category(event.node.category)"
                        :alt="event.node.category"
                    />
                </v-col>
                <v-col>
                    <v-card-title>
                        <router-link
                            class="hover-link"
                            :to="{name: 'Tournament', params: {name: encodeName (event.node.tournament.name), id: event.node.tournament.id}}"
                        >
                            {{ event.node.tournament.name }}
                        </router-link>
                        <span
                            v-if="event.node.sponsor_name"
                            class="text-zinc-400"
                        >
                            | {{ event.node.sponsor_name }}
                        </span>
                    </v-card-title>
                    <v-card-subtitle>{{ event.node.venue.city }}, {{ event.node.venue.country.name }}</v-card-subtitle>
                    <v-card-subtitle>{{ event.node.surface.environment }} {{ event.node.surface.surface }} <span v-if="event.node.surface.hard_type">({{ event.node.surface.hard_type }})</span> | {{ formattedDates(event.node.start_date, event.node.end_date) }}</v-card-subtitle>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-table
                        class="bg-transparent"
                    >
                        <thead>
                            <tr
                                class="text-xs lg:text-sm"
                            >
                                <th
                                    class="!text-center !font-bold"
                                >
                                    Round
                                </th>
                                <th
                                    class="!font-bold"
                                >
                                    Opponent
                                </th>
                                <th
                                    class="!text-center !font-bold"
                                >
                                    Rank
                                </th>
                                <th />
                                <th
                                    class="!font-bold"
                                >
                                    Score
                                </th>
                                <th />
                            </tr>
                        </thead>
                        <tbody>
                            <MatchRow
                                v-for="match in event.node.matches"
                                :key="match.match_no"
                                :match
                                :id
                                :name
                                :players="event.node.playersConnection.edges"
                            />
                        </tbody>
                    </v-table>
                </v-col>
            </v-row>
            <v-row>
                <v-col
                    class="text-zinc-300 text-xs lg:text-sm text-center sm:flex"
                >
                    <div
                        v-if="event.properties.seed"
                        class="small"
                    >
                        seed: {{ event.properties.seed }}
                    </div>
                    <div
                        v-if="event.properties.status"
                        class="mx-2 small"
                    >
                        entry type: {{ event.properties.status }}
                    </div>
                    <div
                        v-if="event.properties.rank"
                        class="mx-2 small"
                    >
                        rank: {{ event.properties.rank }}
                    </div>
                    <div
                        v-if="event.properties.points"
                        class="mx-2 small"
                    >
                        points: {{ event.properties.points }}
                    </div>
                    <div
                        v-if="event.properties.pm"
                        class="mx-2 small"
                    >
                        prize money: {{ formatCurrency(event.node.currency, event.properties.pm) }}
                    </div>
                </v-col>
            </v-row>
        </v-container>
    </v-card>
</template>