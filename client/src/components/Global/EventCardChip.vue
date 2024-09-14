<script setup lang="ts">
import type { Event } from '@/utils/interfaces';
import { encodeName } from '@/utils/functions';

const props = defineProps<{
    event: Event
    name: string
}>()
</script>

<template>
    <v-chip v-if="event.tournament" class="mx-auto text-zinc-300" variant="outlined"
        :to="{ name: name, params: { name: encodeName(event.tournament.name), id: event.tournament.id, year: event.year.id, eventId: event.id } }">
        <slot name="page" />
    </v-chip>
</template>