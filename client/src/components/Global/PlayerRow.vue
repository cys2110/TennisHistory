<script setup>
import { encodeName, flag, headshot } from '@/utils/functions';

const props = defineProps(['player', 'entry'])
</script>

<template>
    <a-row>
        <a-col :span="3">
            <div class="w-full flex items-center">
                <a-image :alt="player.country.name" :src="flag(player.country.id)" class="rounded" :preview="false" />
            </div>
        </a-col>
        <a-col :span="3">
            <a-avatar :alt="player.full_name" :src="headshot(player.id)" class="border-zinc-300 mx-2" />
        </a-col>
        <a-col :span="18" class="text-left px-5">
            <router-link class="hover-link"
                :to="{ name: 'player', params: { name: encodeName(player.full_name), id: player.id } }">{{
                    player.full_name
                }}</router-link> <small v-if="entry">{{ entry }}</small>
        </a-col>
    </a-row>
</template>