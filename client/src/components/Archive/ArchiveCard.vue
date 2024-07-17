<script setup lang="ts">
import { DateTime } from 'luxon';
import type { Event } from '@/utils/interfaces';
import { flag, formattedDates, category, encodeName } from '@/utils/functions';

const props = defineProps<{
    event: Event
}>()
</script>

<template>
    <v-card
        class="my-4 sm:!my-5 !bg-indigo-800 mx-auto h-100 border-zinc-500"
        rounded="xl"
        variant="outlined"
    >
        <v-img
            class="align-end opacity-75"
            :src="flag(event.venue.country.id)"
            :alt="event.venue.country.name"
        >
            <v-chip
                variant="elevated"
                class="!bg-zinc-300 !text-indigo-800 my-1 mx-2"
            >
                {{ formattedDates(event.start_date, event.end_date) }}
            </v-chip>
            <v-chip
                variant="elevated"
                class="!text-indigo-800 !bg-zinc-300 my-1 mx-2"
            >
                {{ event.surface.environment }} {{ event.surface.surface }}
                <span
                    v-if="event.surface.hard_type"
                >
                    ({{ event.surface.hard_type }})
                </span>
            </v-chip>
        </v-img>
        <v-row
            class="mt-1"
        >
            <v-col
                cols="4"
            >
                <v-img
                    v-if="event.category"
                    class="!size-20 mx-auto"
                    :src="category(event.category)"
                    :alt="event.category"
                />
            </v-col>
            <v-col
                cols="8"
            >
                <v-card-title
                    style="text-wrap: wrap;"
                >
                    <router-link
                        class="hover-link"
                        :to="{name: 'Tournament', params: {name: encodeName(event.tournament.name), id: event.tournament.id}}"
                    >
                        {{ event.tournament.name }}
                    </router-link>
                </v-card-title>
                <v-card-subtitle
                    v-if="event.sponsor_name"
                    style="text-wrap: wrap;"
                >
                    {{ event.sponsor_name }}
                </v-card-subtitle>
                <v-card-subtitle
                    class="small mt-1"
                    style="text-wrap: wrap;"
                >
                    {{ event.venue.city }}, {{ event.venue.country.name }}
                </v-card-subtitle>
            </v-col>
        </v-row>
        <v-card-actions
            v-if="DateTime.now() > DateTime.fromISO(event.start_date)"
        >
            <v-chip
                class="mx-auto text-zinc-300"
                variant="outlined"
                :to="{name: 'Event', params: {name: encodeName(event.tournament.name), id: event.tournament.id, year: event.year.id, eventId: event.id}}"
            >
                Results
            </v-chip>
        </v-card-actions>
    </v-card>
</template>