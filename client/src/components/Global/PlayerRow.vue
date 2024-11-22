<script setup>
import { flag, headshot } from '@/utils/functions';

const props = defineProps(['player', 'entry'])
</script>

<template>
    <a-col :span=2>
        <a-image :alt="player.country.name" :src="flag(player.country.id)" class="rounded" :preview="false" />
        <!--[FIX FLAG SIZING]-->
    </a-col>
    <a-col :span=3>
        <a-avatar :alt="player.full_name" :src="headshot(player.id)" class="border-zinc-300 mx-2" />
        <!--[FIX AVATAR SPACING/SIZE]-->
    </a-col>
    <a-col :span=18>
        <!--[ADD PLAYER LINK]-->
        {{ player.full_name }}
        <!--[ADD ENTRY DETAIL]-->
    </a-col>
</template>