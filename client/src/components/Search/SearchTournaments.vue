<script setup lang="ts">
import type { Tournament } from '@/utils/types';
import { encodeName } from '@/utils/functions';

const props = defineProps<{
    tournaments: Pick<Tournament, 'id' | 'name'>[]
}>()
</script>

<template>
    <TabPanel value="1">
        <div class="grid grid-cols-3 gap-3">
            <div v-for="tournament in tournaments" :key="tournament.id"
                class="flex justify-center items-center !text-sm border-[1px] border-zinc-700 p-3 rounded-lg">
                <router-link class="hover-link"
                    :to="{ name: 'tournament', params: { name: encodeName(tournament.name), id: tournament.id } }">
                    {{ tournament.name }}
                </router-link>
            </div>
        </div>
    </TabPanel>
</template>