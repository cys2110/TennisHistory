<script setup lang="ts">
import { flagSrc, headshot } from '../utils';
import type { Entries } from '../interfaces';

const props = defineProps<{
    player: Entries
}>()
</script>

<template>
    <tr>
        <td class="flex items-center text-nowrap">
            <div class="mx-1">
                <flag-img
                    class="w-[2rem]"
                    :src="flagSrc(player.Player.country)"
                    :alt="player.Player.country"
                />
            </div>
            <div class="mx-1">
                <v-avatar size="small">
                    <v-img
                    :src="headshot(player.Player.id)"
                    :alt="player.Player.full_name"
                    />
                </v-avatar>
            </div>
            <div class="mx-1">
                <router-link
                    class="hover-link"
                    :to="{name: 'Player', params: {id: player.Player.id, name: player.Player.full_name}}"
                >
                    {{ player.Player.full_name }}
                </router-link>
            </div>
        </td>
        <td>
            <slot name="reason"></slot>
        </td>
    </tr>
</template>