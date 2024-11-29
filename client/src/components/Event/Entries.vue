<script setup>
import { flag, headshot } from '@/utils/functions';
import { STATUS_INFO } from '@/utils/variables';

const props = defineProps(['entries'])
</script>

<template>
    <div id="entries" class="text-4xl my-5">Entries</div>
    <a-row justify="space-evenly" :gutter="[0, 32]">
        <a-col :span="5" v-for="entry in entries" :key="entry.player.id">
            <a-card class="h-full flex flex-col justify-between pt-5 items-center" :bodyStyle="{ width: '100%' }">
                <template #cover>
                    <a-image :alt="entry.player.full_name" :src="headshot(entry.player.id)"
                        class="!rounded-full !border-zinc-300 border-[1.5px] !w-28" :preview="false" />
                </template>
                <a-card-meta class="text-center">
                    <template #title>
                        <a-row>
                            <a-col :span="4">
                                <a-image :alt="entry.player.country.name" :src="flag(entry.player.country.id)"
                                    :preview="false" class="rounded" />
                            </a-col>
                            <a-col :span="20" class="px-1">
                                <router-link class="hover-link"
                                    :to="{ name: 'player', params: { name: entry.player.full_name, id: entry.player.id } }">{{
                                        entry.player.full_name }}</router-link>
                            </a-col>
                        </a-row>
                    </template>
                    <template #description>
                        <div v-if="entry.seed">Seed: {{ entry.seed }}</div>
                        <div v-if="entry.status">Status: {{ STATUS_INFO[entry.status] }}</div>
                        <div v-if="entry.rank">Rank: {{ entry.rank }}</div>
                    </template>
                </a-card-meta>
            </a-card>
        </a-col>
    </a-row>
</template>