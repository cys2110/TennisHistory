<script setup lang="ts">
import { formattedDates, flagSrc, formatCurrency, categorySrc, encodeName } from '../utils';
import type { PlayerActivity } from '../interfaces';
import MatchRow from './MatchRow.vue';

const props = defineProps<{
    event: PlayerActivity,
    playerId: string,
    playerName: string
}>()
</script>

<template>
    <short-card class="my-5 text-zinc-300">
        <v-container>
            <v-row>
                <v-col cols="3" class="flex items-center">
                    <v-img
                        v-if="event.category"
                        :src="categorySrc(event.category)"
                        :alt="event.category"
                    />
                </v-col>
                <v-col cols="9">
                    <v-card-title>
                        <div class="text-sm lg:text-3xl">{{ event.sponsor_name ?? '' }}</div>
                        <div class="text-sm lg:text-3xl">
                            <router-link
                                class="hover-link"
                                :to="{name: 'Tournament', params: {id: event.tournamentId, name: encodeName(event.tournamentName)}}"
                            >
                                {{ event.tournamentName }}
                            </router-link>
                        </div>
                    </v-card-title>
                    <v-card-subtitle>
                        <div class="flex items-center text-xs lg:text-base">
                            <div>{{ event.city }}</div>
                            <div class="mx-1">
                                <flag-img
                                    class="w-[2rem]"
                                    :src="flagSrc(event.countryId)"
                                    :alt="event.countryName"
                                />
                            </div>
                        </div>
                        <div class="text-xs lg:text-base">
                            <div class="my-1">{{ event.environment }} {{ event.surface }} <span v-if="event.hard_type">({{ event.hard_type }})</span></div>
                            <div class="my-1">{{ formattedDates(event.start_date, event.end_date) }}</div>
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
                                v-for="(match, index) in event.matches"
                                :key="index"
                                :match
                                :playerId
                                :playerName
                            />
                        </tbody>
                    </v-table>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="text-zinc-300 text-xs lg:text-sm text-center sm:flex">
                    <div
                        v-if="event.rank !== null"
                        class="mx-1"
                    >
                        Rank: {{ event.rank }}
                    </div>
                    <div
                        v-if="event.points !== null"
                        class="mx-1"
                    >
                        Points: {{ event.points }}
                    </div>
                    <div
                        v-if="event.currency && event.pm"
                        class="mx-1"
                    >
                        Prize money: {{ formatCurrency(event.currency, event.pm) }}
                    </div>
                </v-col>
            </v-row>
        </v-container>
    </short-card>
</template>