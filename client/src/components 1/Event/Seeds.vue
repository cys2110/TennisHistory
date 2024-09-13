<script setup lang="ts">
import type { Seed } from '@/utils/interfaces';
import { flag, headshot, encodeName } from '@/utils/functions';

const props = defineProps<{
    seeds: Seed[]
}>()
</script>

<template>
    <v-table class="bg-transparent rounded-xl" fixed-header hover>
        <thead class="text-xs text-zinc-300">
            <tr>
                <th class="!font-bold text-center !bg-indigo-800">Seed</th>
                <th class="!font-bold text-center !bg-indigo-800">Player</th>
                <th class="!font-bold text-center !bg-indigo-800">Rank</th>
            </tr>
        </thead>
        <tbody class="text-xs text-zinc-300">
            <tr v-for="seed in seeds" :key="seed.node.id">
                <td class="text-center">{{ seed.properties.seed }}</td>
                <td>
                    <div class="flex items-center">
                        <div class="mx-1">
                            <flag-img v-if="seed.node.country" class="w-[2rem]" :src="flag(seed.node.country.id)"
                                :alt="seed.node.country.name" />
                        </div>
                        <div class="mx-1">
                            <v-avatar size="small">
                                <v-img :src="headshot(seed.node.id)" :alt="seed.node.full_name" />
                            </v-avatar>
                        </div>
                        <div class="mx-1">
                            <router-link class="hover-link" :class="{ 'strikethrough': seed.properties.wd }"
                                :to="{ name: 'Player', params: { id: seed.node.id, name: encodeName(seed.node.full_name) } }">
                                {{ seed.node.full_name }}
                            </router-link>
                        </div>
                    </div>
                </td>
                <td class="text-center" :class="{ 'strikethrough': seed.properties.wd }">{{ seed.properties.rank ?? ''
                    }}
                </td>
            </tr>
        </tbody>
    </v-table>
</template>