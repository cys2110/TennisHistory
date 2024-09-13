<script setup lang="ts">
import type { Title } from '@/utils/interfaces';

const props = defineProps<{
    year: Title
}>()
</script>

<template>
    <tr class="border-zinc-400" :class="{ 'border-b-2': year.count === 1 }">
        <td class="text-center" :rowspan="year.count">{{ year.year }}</td>
        <td class="text-center" :rowspan="year.count">{{ year.count }}</td>
        <td class="text-nowrap">
            <span v-if="year.events[0].sponsor_name">{{ year.events[0].sponsor_name }} | </span>
            <router-link class="hover-link"
                :to="{ name: 'Tournament', params: { name: year.events[0].tournament_name, id: year.events[0].tournament_id } }">
                {{ year.events[0].tournament_name }}
            </router-link>
        </td>
        <td class="text-nowrap">
            <span>{{ year.events[0].environment }} {{ year.events[0].surface }}</span>
            <span v-if="year.events[0].hard_type"> ({{ year.events[0].hard_type }})</span>
        </td>
    </tr>
    <template v-for="(event, index) in year.events">
        <tr v-if="index > 0" class="border-zinc-400" :class="{ 'border-b-2': index === year.count - 1 }">
            <td class="text-nowrap">
                <span v-if="event.sponsor_name">{{ event.sponsor_name }} | </span>
                <router-link class="hover-link"
                    :to="{ name: 'Tournament', params: { name: event.tournament_name, id: event.tournament_id } }">
                    {{ event.tournament_name }}
                </router-link>
            </td>
            <td class="text-nowrap">
                <span>{{ event.environment }} {{ event.surface }}</span>
                <span v-if="event.hard_type"> ({{ event.hard_type }})</span>
            </td>
        </tr>
    </template>
</template>