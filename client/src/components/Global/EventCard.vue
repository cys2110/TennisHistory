<script setup lang="ts">
import { DateTime } from 'luxon';
import type { Event } from '@/utils/interfaces';
import { flag, formattedDates, category, encodeName } from '@/utils/functions';
import Chip from '@/components/Global/EventCardChip.vue';

const props = defineProps<{
    event: Event
}>()
</script>

<template>
    <v-card class="my-4 sm:my-5 bg-indigo-800 mx-auto h-100 border-zinc-500" rounded="xl" variant="outlined">
        <v-img v-if="event.venue" class="align-end opacity-75" :src="flag(event.venue.country.id)"
            :alt="event.venue.country.name">
            <v-img v-if="event.category" class="!size-20 mx-2 my-1 bg-white rounded-circle"
                :src="category(event.category)" :alt="event.category" />
        </v-img>
        <v-card-title class="text-center" style="text-wrap: wrap;">
            <router-link v-if="event.tournament" class="hover-link"
                :to="{ name: 'Tournament', params: { name: encodeName(event.tournament.name), id: event.tournament?.id } }">
                {{ event.tournament.name }}
            </router-link>
        </v-card-title>
        <v-card-subtitle class="small text-center" style="text-wrap: wrap;">{{ event.sponsor_name ?? '—'
            }}</v-card-subtitle>
        <v-card-text class="mt-1 text-zinc-300 text-center" style="text-wrap: wrap;">
            <div>{{ formattedDates(event.start_date, event.end_date) }}</div>
            <div>{{ event.venue?.city }}, {{ event.venue?.country.name }}</div>
            <div>{{ event.surface?.environment }} {{ event.surface?.surface }} <span v-if="event.surface?.hard_type">({{
                event.surface.hard_type }})</span></div>
        </v-card-text>
        <!--If event has started-->
        <v-card-actions v-if="DateTime.now() > DateTime.fromISO(event.start_date)">
            <Chip :event name="Event">
                <template #page>Overview</template>
            </Chip>
            <Chip :event name="Results">
                <template #page>Results</template>
            </Chip>
            <Chip :event name="Draw">
                <template #page>Draw</template>
            </Chip>
        </v-card-actions>
    </v-card>
</template>