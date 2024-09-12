<script setup lang="ts">
import { computed, ref, type Ref } from 'vue';
import { DateTime } from 'luxon';
import type { EventDetails } from '@/utils/interfaces';
import { headshot, flag, encodeName } from '@/utils/functions';

const props = defineProps<{
    event: EventDetails
}>()

const formattedScore = computed(() => {
    if (props.event.final_score) return props.event.final_score.replace(/\(/g, '<sup>').replace(/\)/g, '</sup>')
})
</script>

<template>
    <v-card class="md:min-h-64 bg-indigo-800 border-zinc-500" variant="outlined" rounded="xl">
        <v-card-title class="text-center text-2xl">
            <router-link class="hover-link" :to="{ name: 'Event', params: { year: event.year.id, eventId: event.id } }">
                {{ event.year.id }}
            </router-link>
        </v-card-title>
        <v-container v-if="DateTime.fromISO(event.end_date) < DateTime.now() && event.final_score">
            <v-row dense>
                <v-spacer />
                <v-col class="flex items-center mx-0.5" cols="2">
                    <flag-img v-if="event.winner?.country" :src="flag(event.winner.country.id)"
                        :alt="event.winner.country.name" />
                </v-col>
                <v-col class="flex items-center mx-0.5" cols="2">
                    <v-avatar>
                        <v-img v-if="event.winner" :src="headshot(event.winner.id)" :alt="event.winner.full_name" />
                    </v-avatar>
                </v-col>
                <v-col class="flex items-center mx-2" cols="6">
                    <router-link v-if="event.winner" class="hover-link"
                        :to="{ name: 'Player', params: { name: encodeName(event.winner.full_name), id: event.winner.id } }">
                        {{ event.winner.full_name }}
                    </router-link>
                </v-col>
            </v-row>
            <v-row dense>
                <v-col class="text-center text-zinc-300">
                    d.
                </v-col>
            </v-row>
            <v-row dense>
                <v-spacer />
                <v-col class="flex items-center mx-0.5" cols="2">
                    <flag-img v-if="event.finalist?.country" :src="flag(event.finalist.country.id)"
                        :alt="event.finalist.country.name" />
                </v-col>
                <v-col class="flex items-center mx-0.5" cols="2">
                    <v-avatar>
                        <v-img v-if="event.finalist" :src="headshot(event.finalist.id)"
                            :alt="event.finalist.full_name" />
                    </v-avatar>
                </v-col>
                <v-col class="flex items-center mx-2" cols="6">
                    <router-link v-if="event.finalist" class="hover-link"
                        :to="{ name: 'Player', params: { name: encodeName(event.finalist.full_name), id: event.finalist.id } }">
                        {{ event.finalist.full_name }}
                    </router-link>
                </v-col>
            </v-row>
        </v-container>
        <v-card-subtitle v-if="DateTime.fromISO(event.end_date) < DateTime.now() && event.final_score"
            class="text-center text-zinc-300 text-lg mb-1" v-html="formattedScore" />
        <v-card-subtitle v-else class="text-center text-zinc-300 text-lg mb-1">{{ DateTime.fromISO(event.end_date) <
            DateTime.now() ? 'No final player' : DateTime.fromISO(event.start_date) < DateTime.now()
            ? 'Currently in progress' : 'Upcoming' }} </v-card-subtitle>
    </v-card>
</template>