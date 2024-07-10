<script setup lang="ts">
import { DateTime } from 'luxon';
import { categorySrc, flagSrc, formattedDates, encodeName } from '../utils';
import type { Edition } from '../interfaces';

const props = defineProps<{
    edition: Edition
}>()
</script>

<template>
    <v-card
        class="my-4 sm:!my-5 !bg-indigo-800 mx-auto h-100 border-zinc-500"
        rounded="xl"
        variant="outlined"
    >
        <v-img
            :src="flagSrc(edition.venue.country.id)"
            :alt="edition.venue.country.name"
            class="align-end opacity-75"
        >
            <div class="flex justify-between my-2 mx-1">
                <v-chip
                    variant="elevated"
                    class="!bg-indigo-800 !text-zinc-300"
                >
                    {{ formattedDates(edition.start_date, edition.end_date) }}
                </v-chip>
                <v-chip
                    variant="elevated"
                    class="!bg-indigo-800 !text-zinc-300"
                >
                    {{ edition.surface.environment }} {{ edition.surface.surface }}
                    <span v-if="edition.surface.hard_type"> ({{ edition.surface.hard_type }})</span>
                </v-chip>
            </div>
        </v-img>
        <v-row class="mt-1">
            <v-col cols="4">
                <v-img
                    v-if="edition.category"
                    class="!size-20 mx-auto"
                    :src="categorySrc(edition.category)"
                    :alt="edition.category"
                />
            </v-col>
            <v-col cols="8">
                <v-card-title style="text-wrap: wrap;">
                    <router-link
                        :to="{name: 'Tournament', params: {name: encodeName(edition.tournament.name), id: edition.tournament.id}}"
                        class="hover-link"
                    >
                        {{ edition.tournament.name }}
                    </router-link>
                </v-card-title>
                <v-card-subtitle v-if="edition.sponsor_name" style="text-wrap: wrap;">{{ edition.sponsor_name }}</v-card-subtitle>
                <v-card-subtitle class="small mt-1">{{ edition.venue.city }}, {{ edition.venue.country.name }}</v-card-subtitle>
            </v-col>
        </v-row>
        <v-card-actions>
            <v-chip
                v-if="DateTime.now() > DateTime.fromISO(edition.start_date)"
                class="mx-auto text-zinc-300"
                variant="outlined"
                :to="{name: 'Edition', params: {name: encodeName(edition.tournament.name), id: edition.tournament.id, year: edition.year.id, editionNo: edition.id}}"
            >
                Results
            </v-chip>
        </v-card-actions>
    </v-card>
</template>

<style scoped>
.small {
    font-variant: small-caps;
}
</style>