<script setup lang="ts">
import type { Edge, Lda, Ret, Wd, Wo, Defaulted } from '@/utils/interfaces'
import { flag, headshot, encodeName } from '@/utils/functions'

const props = defineProps<{
    player: Lda | Edge | Ret | Wd | Wo | Defaulted
}>()
</script>

<template>
    <tr>
        <td class="flex items-center text-nowrap">
            <div class="mx-1">
                <flag-img
                    v-if="player.node.country"
                    class="w-[2rem]"
                    :src="flag(player.node.country.id)"
                    :alt="player.node.country.name"
                />
            </div>
            <div class="mx-1">
                <v-avatar size="small">
                    <v-img
                    :src="headshot(player.node.id)"
                    :alt="player.node.full_name"
                    />
                </v-avatar>
            </div>
            <div class="mx-1">
                <router-link
                    class="hover-link"
                    :to="{name: 'Player', params: {id: player.node.id, name: encodeName(player.node.full_name)}}"
                >
                    {{ player.node.full_name }}
                </router-link>
            </div>
        </td>
        <td class="text-zinc-300 text-xs">
            <slot name="reason"></slot>
        </td>
    </tr>
</template>