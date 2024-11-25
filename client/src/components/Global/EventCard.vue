<script setup>
import { computed } from 'vue';
import { DateTime } from 'luxon';
import { category, encodeName, flag, formattedDates } from '@/utils/functions';
import { SURFACES } from '@/utils/variables';

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

const isDisabled = DateTime.now() < DateTime.fromISO(props.event.start_date)
</script>

<template>
    <a-config-provider :theme="{ components: { Card: cardTheme } }">
        <a-card class="h-full flex flex-col justify-between">
            <template #cover>
                <a-image :alt="coverImage.alt" :src="coverImage.src" :preview="false" />
            </template>
            <template #actions>
                <!--[FIX BUTTON STYLING]-->
                <a-tooltip v-if="isDisabled" v-for="page in eventPages" :key="page.name"
                    title="Event has not started yet">
                    <a-button type="dashed" :ghost="true" shape="round" size="small" :block="true" :disabled="true"
                        class="!w-11/12 custom-disabled !text-zinc-300 !border-zinc-300 hover:!text-zinc-400 hover:!border-zinc-400"
                        :href="`/tournaments/${encodeName(event.tournament.name)}/${event.tournament.id}/${event.year.id}/${event.id}/${page.name}`">{{
                            page.title }}</a-button>
                </a-tooltip>
                <a-button v-else v-for="page in eventPages" :key="page.name" type="dashed" :ghost="true" shape="round"
                    size="small" :block="true"
                    class="!w-11/12 custom-disabled !text-zinc-300 !border-zinc-300 hover:!text-zinc-400 hover:!border-zinc-400"
                    :href="`/tournaments/${encodeName(event.tournament.name)}/${event.tournament.id}/${event.year.id}/${event.id}/${page.name}`">{{
                        page.title }}</a-button>
            </template>
            <!--[FIX COVER STYLING]-->
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