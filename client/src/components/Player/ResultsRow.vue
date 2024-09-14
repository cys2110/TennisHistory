<script setup lang="ts">
import type { MajorYears } from '@/utils/interfaces';
import { encodeName } from '@/utils/functions'

const props = defineProps<{
    tournamentName: string,
    tournamentId: number,
    events: MajorYears[]
}>()
</script>

<template>
    <tr style="height: 0;">
        <td class="text-center">
            <router-link class="hover-link"
                :to="{ name: 'Tournament', params: { name: encodeName(tournamentName), id: tournamentId } }">
                {{ tournamentName }}
            </router-link>
        </td>
        <td class="text-center">
            <span v-if="events.length > 0">
                {{ events[0].round }} ({{ events.length }})
            </span>
            <span v-else>
                —
            </span>
        </td>
        <td>
            <div v-if="events.length > 0" class="d-flex flex-col py-1 text-center">
                <router-link v-for="round in events" :key="round.event.id" class="hover-link"
                    :to="{ name: 'Event', params: { name: encodeName(tournamentName), id: tournamentId, year: round.event.year.id, eventId: round.event.id } }">
                    {{ round.event.year.id }}
                </router-link>
            </div>
            <div v-else>
                —
            </div>
        </td>
    </tr>
</template>