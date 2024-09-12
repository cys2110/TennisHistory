<script setup lang="ts">
import type { Player } from '@/utils/interfaces';
import { flag, headshot, encodeName } from '@/utils/functions';

const props = defineProps<{
    player: Player
}>()
</script>

<template>
    <div class="mx-0.5">
        <flag-img v-if="player.country" class="w-[1rem] lg:w-[2rem]" :src="flag(player.country.id)"
            :alt="player.country.name" />
    </div>
    <div class="mx-0.5">
        <v-avatar size="small">
            <v-img :src="headshot(player.id)" :alt="player.full_name" />
        </v-avatar>
    </div>
    <div class="mx-0.5">
        <router-link class="hover-link"
            :to="{ name: 'Player', params: { name: encodeName(player.full_name), id: player.id } }">
            {{ player.full_name }}
        </router-link>
        <slot name="status" />
    </div>
</template>