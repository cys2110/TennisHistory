<script setup lang="ts">
import { flagSrc, headshot, encodeName } from '../utils';
import type { PlayerCountry } from '../interfaces';

const props = defineProps<{
    player: PlayerCountry
}>()
</script>

<template>
    <tr>
        <td class="flex items-center text-nowrap">
            <div class="mx-1">
                <flag-img
                    class="w-[2rem]"
                    :src="flagSrc(player.country.id)"
                    :alt="player.country.name"
                />
            </div>
            <div class="mx-1">
                <v-avatar size="small">
                    <v-img
                    :src="headshot(player.id)"
                    :alt="player.full_name"
                    />
                </v-avatar>
            </div>
            <div class="mx-1">
                <router-link
                    class="hover-link"
                    :to="{name: 'Player', params: {id: player.id, name: encodeName(player.full_name)}}"
                >
                    {{ player.full_name }}
                </router-link>
            </div>
        </td>
        <td>
            <slot name="reason"></slot>
        </td>
    </tr>
</template>