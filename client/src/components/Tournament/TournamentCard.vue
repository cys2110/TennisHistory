<script setup lang="ts">
import { computed, ref, type Ref } from 'vue';
import { DateTime } from 'luxon';
import { headshot, flagSrc, encodeName } from '../utils';
import type { TournamentEvent } from '../interfaces';

const props = defineProps<{
    event: TournamentEvent
}>()
const display: Ref<boolean> = ref(true)
const noFinal: Ref<boolean> = ref(false)

DateTime.fromISO(props.event.end_date) < DateTime.now() ? display.value = true : display.value = false
props.event.final_score ? noFinal.value = false : noFinal.value = true

const formattedScore = computed(() => {
    if (props.event.final_score) {
        return props.event.final_score.replace(/\(/g, '<sup>').replace(/\)/g, '</sup>')
    }
});
</script>

<template>
    <v-card
        class="md:min-h-64 bg-indigo-800 border-zinc-500"
        variant="outlined"
        rounded="xl"
    >
        <v-card-title class="text-center text-2xl">
            <router-link
                class="hover-link"
                :to="{name: 'Edition', params: {year: event.year.id, editionNo: event.id}}"
            >
                {{ event.year.id }}
            </router-link>
        </v-card-title>
        <v-container v-if="display && !noFinal">
            <v-row dense>
                <v-spacer />
                <v-col
                    class="flex items-center mx-0.5"
                    cols="2"
                >
                    <flag-img
                        :src="flagSrc(event.winner.country.id)"
                        :alt="event.winner.country.name"
                    />
                </v-col>
                <v-col
                    class="flex items-center mx-0.5"
                    cols="2"
                >
                    <v-avatar>
                        <v-img
                            :src="headshot(event.winner.id)"
                            :alt="event.winner.full_name"
                        />
                    </v-avatar>
                </v-col>
                <v-col
                    class="flex items-center mx-2"
                    cols="6"
                >
                    <router-link
                        class="hover-link"
                        :to="{name: 'Player', params: {id: event.winner.id, name: encodeName(event.winner.full_name)}}"
                    >
                        {{ event.winner.full_name }}
                    </router-link>
                </v-col>
            </v-row>
            <v-row dense>
                <v-col class="text-center text-zinc-300">d.</v-col>
            </v-row>
            <v-row dense>
                <v-spacer/>
                <v-col
                    class="flex items-center mx-0.5"
                    cols="2"
                >
                    <flag-img
                        :src="flagSrc(event.finalist.country.id)"
                        :alt="event.finalist.country.name"
                    />
                </v-col>
                <v-col
                    class="flex items-center mx-0.5"
                    cols="2"
                >
                    <v-avatar>
                        <v-img
                            :src="headshot(event.finalist.id)"
                            :alt="event.finalist.full_name"
                        />
                    </v-avatar>
                </v-col>
                <v-col class="flex items-center mx-2" cols="6">
                    <router-link
                        class="hover-link"
                        :to="{name: 'Player', params: {id: event.finalist.id, name: encodeName(event.finalist.full_name)}}"
                    >
                        {{ event.finalist.full_name }}
                    </router-link>
                </v-col>
            </v-row>
        </v-container>
        <v-card-subtitle
            v-if="display && !noFinal"
            class="text-center text-zinc-300 text-lg"
            v-html="formattedScore"
        />
        <v-card-subtitle v-else>{{ display && noFinal ? 'No final played' : 'Currently in progress' }}</v-card-subtitle>
    </v-card>
</template>