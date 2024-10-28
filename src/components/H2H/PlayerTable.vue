<script setup lang="ts">
import { useDisplay } from 'vuetify';
import { DateTime } from 'luxon'
import type { PlayerDetails } from '@/utils/interfaces';
import { convertToFt, plays, bh } from '@/utils/functions';
import PlayerStatItem from '@/components/H2H/PlayerStatItem.vue';

const props = defineProps<{
    player: PlayerDetails
    p1: boolean
}>()
const { mdAndUp } = useDisplay()
</script>

<template>
    <v-col cols="4">
        <v-card v-if="mdAndUp" class="p-3 text-zinc-30" :class="{ 'bg-indigo-800': p1, 'bg-green-800': !p1 }"
            rounded="xl">
            <PlayerStatItem>
                <template #field>DOB</template>
                <template #value>{{ player.dob ? DateTime.fromISO(player.dob).setLocale('gb').toFormat('dd LLLL yyyy') :
                    'Unknown' }}</template>
            </PlayerStatItem>
            <PlayerStatItem>
                <template #field>Height</template>
                <template #value>{{ player.height_cm ? `${player.height_cm} cm
                    (${convertToFt(player.height_cm)})` : 'Unknown' }}</template>
            </PlayerStatItem>
            <PlayerStatItem>
                <template #field>Plays</template>
                <template #value>{{ player.rh !== null && player.rh !== undefined ? plays(player.rh) : 'Unknown'
                    }}</template>
            </PlayerStatItem>
            <PlayerStatItem>
                <template #field>Backhand</template>
                <template #value>{{ player.bh1 !== null && player.bh1 !== undefined ? bh(player.bh1) : 'Unknown'
                    }}</template>
            </PlayerStatItem>
            <PlayerStatItem>
                <template #field>Turned pro</template>
                <template #value>{{ player.turned_pro?.id }}</template>
            </PlayerStatItem>
        </v-card>
    </v-col>
</template>