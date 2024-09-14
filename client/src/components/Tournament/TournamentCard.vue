<script setup lang="ts">
import { computed, ref, type Ref } from 'vue';
import { DateTime } from 'luxon';
import type { Event } from '@/utils/interfaces';
import TournamentPlayer from '@/components/Tournament/TournamentPlayer.vue';

const props = defineProps<{
    event: Event
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
        <v-container v-if="event.winner && event.finalist">
            <v-row dense>
                <TournamentPlayer :player="event.winner" />
            </v-row>
            <v-row dense>
                <v-col class="text-center text-zinc-300">
                    d.
                </v-col>
            </v-row>
            <v-row dense>
                <TournamentPlayer :player="event.finalist" />
            </v-row>
        </v-container>
        <v-card-subtitle v-if="event.final_score" class="text-center text-zinc-300 text-lg mb-1"
            v-html="formattedScore" />
        <v-card-subtitle v-else class="text-center text-zinc-300 text-lg mb-1">{{ DateTime.fromISO(event.end_date) <
            DateTime.now() ? 'No final player' : DateTime.fromISO(event.start_date) < DateTime.now()
            ? 'Currently in progress' : 'Upcoming' }} </v-card-subtitle>
    </v-card>
</template>