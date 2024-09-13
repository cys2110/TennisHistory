<script setup lang="ts">
import type { Player } from '@/utils/interfaces';
import { headshot, flag, encodeName } from '@/utils/functions';

const props = defineProps<{
    player: Player
}>()
</script>

<template>
    <v-spacer />
    <v-col class="flex items-center mx-0.5" cols="2">
        <flag-img :src="flag(player.country.id)" :alt="player.country.name" />
    </v-col>
    <v-col class="flex items-center mx-0.5" cols="2">
        <v-avatar>
            <v-img :src="headshot(player.id)" :alt="player.full_name" />
        </v-avatar>
    </v-col>
    <v-col class="flex items-center mx-0.5" cols="6">
        <router-link class="hover-link"
            :to="{ name: 'Player', params: { name: encodeName(player.full_name), id: player.id } }">
            {{ player.full_name }}
        </router-link>
    </v-col>
</template>