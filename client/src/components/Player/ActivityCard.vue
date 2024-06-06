<script setup lang="ts">
import { formattedDates, flagSrc, formatCurrency, categorySrc, encodeName } from '../utils';
import type { EntriesByPlayer, EntriesMatch } from '../interfaces';
import MatchRow from './MatchRow.vue';

const props = defineProps<{
    entry: EntriesByPlayer,
    playerId: string
}>()

const matches: EntriesMatch[] = [...props.entry.entry1, ...props.entry.entry2]
const sortedMatches = matches.sort((a: EntriesMatch, b: EntriesMatch) => {
    return a.id - b.id
})
</script>

<template>
    <short-card class="my-5 text-zinc-300">
        <v-container>
            <v-row>
                <v-col cols="3" class="flex items-center">
                    <v-img
                        v-if="entry.Edition.category"
                        :src="categorySrc(entry.Edition.category)"
                        :alt="entry.Edition.category"
                    />
                </v-col>
                <v-col cols="9">
                    <v-card-title>
                        <div class="text-sm lg:text-3xl">{{ entry.Edition.sponsor_name ?? '' }}</div>
                        <div class="text-sm lg:text-3xl">
                            <router-link
                                class="hover-link"
                                :to="{name: 'Tournament', params: {id: entry.Edition.Tournament.id, name: encodeName(entry.Edition.Tournament.name)}}"
                            >
                                {{ entry.Edition.Tournament.name }}
                            </router-link>
                        </div>
                    </v-card-title>
                    <v-card-subtitle>
                        <div class="flex items-center text-xs lg:text-base">
                            <div>{{ entry.Edition.city }}</div>
                            <div class="mx-1">
                                <flag-img
                                    class="w-[2rem]"
                                    :src="flagSrc(entry.Edition.country)"
                                    :alt="entry.Edition.country"
                                />
                            </div>
                        </div>
                        <div class="text-xs lg:text-base">
                            <div class="my-1">{{ entry.Edition.environment }} {{ entry.Edition.surface }} <span v-if="entry.Edition.hard_type">({{ entry.Edition.hard_type }})</span></div>
                            <div class="my-1">{{ formattedDates(entry.Edition.start_date, entry.Edition.end_date) }}</div>
                        </div>
                    </v-card-subtitle>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-table class="bg-transparent">
                        <thead>
                            <tr class="text-xs lg:text-sm">
                                <th class="!text-center !font-bold">Round</th>
                                <th class="!font-bold">Opponent</th>
                                <th class="!text-center !font-bold"></th>
                                <th class="!font-bold">Score</th>
                                <th class="!text-center !font-bold"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <MatchRow
                                v-for="match in sortedMatches"
                                :key="match.id"
                                :match
                                :playerId
                            />
                        </tbody>
                    </v-table>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="text-zinc-300 text-xs lg:text-sm text-center sm:flex">
                    <div
                        v-if="entry.rank !== null"
                        class="mx-1"
                    >
                        Rank: {{ entry.rank }}
                    </div>
                    <div
                        v-if="entry.points !== null"
                        class="mx-1"
                    >
                        Points: {{ entry.points }}
                    </div>
                    <div
                        v-if="entry.Edition.currency && entry.pm !== null"
                        class="mx-1"
                    >
                        Prize money: {{ formatCurrency(entry.Edition.currency, entry.pm) }}
                    </div>
                </v-col>
            </v-row>
        </v-container>
    </short-card>
</template>