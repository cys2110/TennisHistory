<script setup>
import { computed } from 'vue';
import { SURFACES } from '@/utils/variables';
import { category, encodeName, flag, formattedDates } from '@/utils/functions';

const cardTheme = { colorBgContainer: "#5b21b6" }

const props = defineProps(['event'])

const coverImage = computed(() => {
    return {
        alt: props.event.venue?.country.name || props.event.category,
        src: props.event.venue ? flag(props.event.venue.country.id) : category(props.event.category)
    }
})

const eventPages = [
    { title: 'Details', name: 'event' },
    { title: 'Results', name: 'results' },
    { title: 'Draw', name: 'draw' }
]
</script>

<template>
    <a-config-provider :theme="{ components: { Card: cardTheme } }">
        <a-card class="h-full flex flex-col justify-between">
            <template #cover>
                <a-image :alt="coverImage.alt" :src="coverImage.src" :preview="false" />
            </template>
            <!--[FIX COVER STYLING AND EVENT BUTTONS]-->
            <a-card-meta :description="event.sponsor_name ?? ''">
                <template #title><router-link class="hover-link"
                        :to="{ name: 'tournament', params: { name: encodeName(event.tournament.name), id: event.tournament.id } }">{{
                            event.tournament.name }}</router-link></template>
            </a-card-meta>
            <a-row>
                <a-col :span=19>
                    <div class="mt-3 flex flex-col justify-center">
                        <div v-if="event.venue">{{ event.venue.city }}, {{ event.venue.country.name }}</div>
                        <div>{{ formattedDates(event.start_date, event.end_date) }}</div>
                        <div v-if="event.surface">{{ SURFACES[event.surface.id] }}</div>
                    </div>
                </a-col>
                <a-col :span=5 class="self-center">
                    <a-image v-if="event.category && event.venue" :alt="event.category"
                        :src="category(event.category)" />
                    <!--[FIX SIZE OF IMAGE]-->
                </a-col>
            </a-row>
        </a-card>
    </a-config-provider>
</template>