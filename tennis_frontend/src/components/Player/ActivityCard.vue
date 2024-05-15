<script setup>
import { formattedDates, flagSrc, formatCurrency, categorySrc } from '../utils';
import MatchRow from './MatchRow.vue';
import { RouterLink } from 'vue-router';

const props = defineProps(['entry'])
const matches = [...props.entry.entry1, ...props.entry.entry2]
const sortedMatches = matches.toSorted((a, b) => {
        return a.id - b.id
    }
)

</script>

<template>
    <short-card class="ma-10 pt-9 pb-5 px-10 w-75 mx-auto">
        <v-row>
            <v-col>
                <v-img :src="categorySrc(entry.Edition.category)" class="filter" />
            </v-col>
            <v-col cols="9">
                <v-card-title class="text-h5">
                    <div v-if="entry.Edition.sponsor_name">{{ entry.Edition.sponsor_name }}</div>
                    <div>
                        <RouterLink class="hover-link" :to="{name: 'Tournament', params: {id: entry.Edition.Tournament.id, name: entry.Edition.Tournament.name}}">{{ entry.Edition.Tournament.name }}</RouterLink>
                    </div>
                </v-card-title>
                <v-card-subtitle>
                    <div class="d-flex text-subtitle-1">
                        {{ entry.Edition.city }} 
                    | {{ entry.Edition.environment }} {{ entry.Edition.surface }}<span v-if="entry.Edition.hard_type">&nbsp;({{ entry.Edition.hard_type }})&nbsp;</span> | &nbsp;
                    <span>{{ formattedDates(entry.Edition.start_date, entry.Edition.end_date) }}</span>
                    </div>
                </v-card-subtitle>
            </v-col>
            <v-col class="d-flex align-center">
                <flag-img :src="flagSrc(entry.Edition.country)" :alt="entry.Edition.country"/>
            </v-col>
        </v-row>
        <v-row></v-row>
        <v-row>
            <v-col>
                <v-table
                class="bg-transparent"
                >
                    <thead>
                        <tr>
                            <th class="font-weight-bold text-center">Round</th>
                            <th class="font-weight-bold">Opponent</th>
                            <th class="font-weight-bold"></th>
                            <th class="font-weight-bold">Score</th>
                            <th class="font-weight-bold"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="match in sortedMatches" :key="match.id">
                            <MatchRow :match :id="entry.PlayerId" />
                        </tr>
                    </tbody>
                </v-table>
            </v-col>
        </v-row>
        <v-row>
            <v-col class="d-flex justify-space-between">
                <span v-if="entry.rank !== null" class="text-button">Rank: {{ entry.rank }}</span>
                <span v-if="entry.points !== null" class="text-button">Points: {{ entry.points }}</span>
                <span v-if="entry.pm !== null" class="text-button">Prize money: {{ formatCurrency(entry.Edition.currency, entry.pm) }}</span>
            </v-col>
        </v-row>
    </short-card>
</template>