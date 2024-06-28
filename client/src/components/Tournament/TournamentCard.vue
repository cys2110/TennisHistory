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
    <short-card class="md:min-h-64">
        <v-container>
            <v-row>
                <v-col class="text-center text-2xl">
                    <router-link
                        class="hover-link"
                        :to="{name: 'Edition', params: {year: event.year.id, editionNo: event.id}}"
                    >
                        {{ event.year.id }}
                    </router-link>
                </v-col>
            </v-row>
            <v-row 
                v-if="display && !noFinal"
                dense
            >
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
                <v-col class="flex items-center mx-2">
                    <router-link
                        class="hover-link"
                        :to="{name: 'Player', params: {id: event.winner.id, name: encodeName(event.winner.full_name)}}"
                    >
                        {{ event.winner.full_name }}
                    </router-link>
                </v-col>
            </v-row>
            <v-row v-if="display && !noFinal">
                <v-col class="text-center text-zinc-300">d.</v-col>
            </v-row>
            <v-row
                v-if="display && !noFinal"
                dense
            >
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
                <v-col class="flex items-center mx-2">
                    <router-link
                        class="hover-link"
                        :to="{name: 'Player', params: {id: event.finalist.id, name: encodeName(event.finalist.full_name)}}"
                    >
                        {{ event.finalist.full_name }}
                    </router-link>
                </v-col>
            </v-row>
            <v-row v-if="display && !noFinal">
                <v-col class="text-center text-zinc-300" v-html="formattedScore" />
            </v-row>
            <!--If no final played-->
            <v-row 
                v-if="display && noFinal"
                class="text-center text-zinc-300"
            >
                <v-col>No final played</v-col>
            </v-row>

            <!--If tournament currently in progress-->
            <v-row
                v-if="!display"
                class="text-center text-zinc-300"
            >
                <v-col>Currently in progress</v-col>
            </v-row>
        </v-container>
    </short-card>
</template>