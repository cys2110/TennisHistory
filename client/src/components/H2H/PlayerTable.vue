<script setup>
import { computed } from 'vue';
import { convertToFt, flag, smallDate } from '@/utils/functions';

const props = defineProps(['player', 'number'])
const cardTheme = { colorBgContainer: props.number === 1 ? '#6d28d9' : "#166534" }

const playingHand = computed(() => {
    switch (props.player.rh) {
        case true:
            return "Right-handed"
        case false:
            return "Left-handed"
        default:
            return 'Unknown'
    }
})

const backhand = computed(() => {
    switch (props.player.bh1) {
        case true:
            return 'One-handed'
        case false:
            return 'Two-handed'
        default:
            return 'Unknown'
    }
})
</script>

<template>
    <a-config-provider :theme="{ components: { Card: cardTheme } }">
        <a-card>
            <!--[TODO: PLAYER LINK]-->
            <template #title>{{ player.full_name }}</template>
            <!--[TODO: FIX FLAG SIZING]-->
            <!-- <template #extra>
                <div class="w-1/3">
                    <a-image :preview="false" :alt="player.country.name" :src="flag(player.country.id)"
                        class="rounded-lg" />
                </div>
            </template> -->
            <a-card-meta>
                <template #description>
                    <!--[TODO: ITERATE]-->
                    <div class="flex justify-between">
                        <span>DOB</span>
                        <span class="font-bold">{{ player.dob ? smallDate(player.dob) : 'Unknown' }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Height</span>
                        <span class="font-bold">{{ player.height_cm ? `${player.height_cm} cm
                            (${convertToFt(player.height_cm)})` : 'Unknown' }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Plays</span>
                        <span class="font-bold">{{ playingHand }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Backhand</span>
                        <span class="font-bold">{{ backhand }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Turned pro</span>
                        <span class="font-bold">{{ player.turned_pro?.id ?? 'Unknown' }}</span>
                    </div>
                </template>
            </a-card-meta>
        </a-card>
    </a-config-provider>
</template>