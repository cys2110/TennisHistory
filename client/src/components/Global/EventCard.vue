<script setup>
import { computed } from 'vue';
import { DateTime } from 'luxon';
import { category, encodeName, flag, formattedDates } from '@/utils/functions';
import { SURFACES } from '@/utils/variables';

// Variables
const props = defineProps(['event'])
const eventPages = [
    { title: 'Details', name: 'event' },
    { title: 'Results', name: 'results' },
    { title: 'Draw', name: 'draw' }
]
const isDisabled = DateTime.now() < DateTime.fromISO(props.event.start_date)
const tournamentParams = { name: encodeName(props.event.tournament.name), id: props.event.tournament.id }
const eventParams = { ...tournamentParams, year: props.event.year.id, eid: props.event.id }

const coverImage = computed(() => {
    return {
        alt: props.event.venue?.country.name || props.event.category,
        src: props.event.venue ? flag(props.event.venue.country.id) : category(props.event.category)
    }
})

</script>

<template>
    <a-card class="h-full flex flex-col justify-between">
        <template #cover>
            <a-image :alt="coverImage.alt" :src="coverImage.src" :preview="false" />
        </template>
        <template #actions>
            <a-button v-for="page in eventPages" :key="page.name" type="dashed" :ghost="true" shape="round" size="small"
                :block="true" :disabled="isDisabled" class="!w-11/12 !border-zinc-300 hover:!border-zinc-400">
                <template v-if="isDisabled">
                    <a-tooltip title="Event has not started yet">{{ page.title }}</a-tooltip>
                </template>
                <template v-else>
                    <router-link class="!text-zinc-300 hover:!text-zinc-400"
                        :to="{ name: page.name, params: eventParams }">
                        {{ page.title }}</router-link>
                </template>
            </a-button>
        </template>
        <a-card-meta :description="event.sponsor_name ?? ''">
            <template #title><router-link class="hover-link" :to="{ name: 'tournament', params: tournamentParams }">{{
                event.tournament.name }}</router-link></template>
        </a-card-meta>
        <a-row>
            <a-col :span="18">
                <div class="mt-3 flex flex-col justify-center">
                    <div v-if="event.venue">{{ event.venue.city }}, {{ event.venue.country.name }}</div>
                    <div>{{ formattedDates(event.start_date, event.end_date) }}</div>
                    <div v-if="event.surface">{{ SURFACES[event.surface.id] }}</div>
                </div>
            </a-col>
            <a-col :span="6" class="self-center">
                <div class="w-full">
                    <a-image v-if="event.category && event.venue" :alt="event.category" :src="category(event.category)"
                        class="object-cover" />
                </div>
            </a-col>
        </a-row>
    </a-card>
</template>