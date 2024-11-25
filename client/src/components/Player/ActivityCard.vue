<script setup>
import { encodeName, formattedDates } from '@/utils/functions';
import { CURRENCIES, SURFACES } from '@/utils/variables';

const cardTheme = { colorBgContainer: "#5b21b6" }
const props = defineProps(['event', 'id', 'name'])
const eventDetails = props.event.scores[0].match.round.event
</script>

<template>
    <a-config-provider :theme="{ components: { Card: cardTheme } }">
        <a-card :id="eventDetails.tournament.name">
            <template #title>
                <div><span v-if="eventDetails.sponsor_name">{{ eventDetails.sponsor_name }} | </span>
                    <router-link class="hover-link"
                        :to="{ name: 'tournament', params: { name: encodeName(eventDetails.tournament.name), id: eventDetails.tournament.id } }">{{
                            eventDetails.tournament.name }}</router-link>
                </div>
                <div>{{ formattedDates(eventDetails.start_date, eventDetails.end_date) }} | {{ eventDetails.venue.city
                    }},
                    {{ eventDetails.venue.country.name }}</div>
            </template>
            <template #extra>
                <div>
                    <div>{{ eventDetails.category }}</div>
                    <div>{{ SURFACES[eventDetails.surface.id] }}</div>
                </div>
            </template>
            <ActivityRow v-for="(match, index) in event.scores" :key="index" :match="match.match" :event="eventDetails"
                :name :id />
            <a-card-meta>
                <template #description>
                    <!--[TODO: SPACING]-->
                    <div class="flex">
                        <div v-if="event.seed">Seed: {{ event.seed }}</div>
                        <div v-if="event.status">Status: {{ event.status }}</div>
                        <div>Points: {{ event.points }}</div>
                        <div>Rank: {{ event.rank }}</div>
                        <!--[TODO: THOUSAND SEPARATOR]-->
                        <div>Prize Money: {{ CURRENCIES[eventDetails.currency] }}{{ event.pm }}</div>
                    </div>
                </template>
            </a-card-meta>
        </a-card>
    </a-config-provider>
</template>