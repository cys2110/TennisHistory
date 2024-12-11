<script setup lang="ts">
import type { Player } from '@/utils/types';
import { encodeName, headshot } from '@/utils/functions';

const props = defineProps<{
    players: Pick<Player, 'id' | 'full_name' | 'country'>[]
}>()
</script>

<template>
    <TabPanel value="0">
        <div class="grid grid-cols-3 gap-3">
            <div v-for="player in players" :key="player.id"
                class="flex items-center !text-sm border-[1px] border-zinc-700 p-3 rounded-lg">
                <div>
                    <GetFlag :country="player.country.id" />
                </div>
                <Avatar style="border: 1px solid #d4d4d8" shape="circle" :image="headshot(player.id)" class="mx-2" />
                <div class="ml-2">
                    <router-link class="hover-link"
                        :to="{ name: 'player', params: { name: encodeName(player.full_name), id: player.id } }">
                        {{ player.full_name }}
                    </router-link>
                </div>
            </div>
        </div>
    </TabPanel>
</template>