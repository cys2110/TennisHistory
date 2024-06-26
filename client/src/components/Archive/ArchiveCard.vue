<script setup lang="ts">
import { DateTime } from 'luxon';
import { useDisplay } from 'vuetify';
import { categorySrc, encodeName, formattedDates, flagSrc } from '../utils';
import type { Edition } from '../interfaces';

const props = defineProps<{
    edition: Edition
}>()
const { smAndDown } = useDisplay()
</script>

<template>
    <v-card
        class="my-4 sm:!my-5 !bg-indigo-800 lg:w-4/5 mx-auto"
        :rounded="smAndDown ? 'xl' : 'pill'"
        variant="text"
    >
        <v-container>
            <v-row>
                <v-col
                    class="flex items-center"
                    cols="12"
                    sm="3"
                >
                    <v-img
                        v-if="edition.category"
                        class="!size-20 mx-auto"
                        :src="categorySrc(edition.category.id)"
                        :alt="edition.category.id"
                    />
                </v-col>
                <v-col
                    class="text-center sm:!text-left text-zinc-300 flex-col"
                    cols="12"
                    sm="7"
                >
                    <div
                        v-if="edition.sponsor_name"
                        class="py-0.5 text-xl"
                    >
                        {{ edition.sponsor_name }}
                    </div>
                    <div class="text-xl py-0.5">
                        <router-link
                            class="hover-link"
                            :to="{name: 'Tournament', params: {id: edition.tournament.id, name: encodeName(edition.tournament.name)}}"
                        >
                            {{ edition.tournament.name }}
                        </router-link>
                    </div>
                    <div class="flex justify-center sm:!justify-start py-0.5">
                        <div>{{ edition.venue.city }}</div>
                        <div class="!w-9">
                            <flag-img
                                class="mx-1"
                                :src="flagSrc(edition.venue.country.id)"
                                :alt="edition.venue.country.name"
                            />
                        </div>
                    </div>
                    <div class="py-0.5">{{ formattedDates(edition.start_date, edition.end_date) }}</div>
                    <div class="py-0.5">{{ edition.surface.environment }} {{ edition.surface.surface }}<span v-if="edition.surface.hard_type"> ({{ edition.surface.hard_type }})</span></div>
                </v-col>
                <v-col
                    class="text-center flex justify-center items-center"
                    cols="12"
                    sm="2"
                >
                    <v-chip
                        v-if="DateTime.now() > DateTime.fromISO(edition.start_date)"
                        variant="outlined"
                        :to="{name: 'Edition', params: {name: encodeName(edition.tournament.name), id: edition.tournament.id, editionNo: edition.id}}"
                    >
                        Results
                    </v-chip>
                </v-col>
            </v-row>
        </v-container>
    </v-card>
</template>