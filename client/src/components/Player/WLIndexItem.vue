<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    win: number,
    total: number,
    titles?: number
}>()

const index = computed(() => {
    const decimal = props.win / (props.total)
    return isNaN(decimal) ? 'N/A' : parseFloat(decimal.toFixed(3))
})
</script>

<template>
    <div class="text-zinc-300">
        <v-row class="mt-1" dense>
            <v-col cols="1">{{ win }}</v-col>
            <v-col>
                <div class="font-bold text-center">
                    <slot name="metric"></slot>
                </div>
                <div>
                    
                </div>
            </v-col>
            <v-col cols="1">{{ total - win }}</v-col>
        </v-row>
        <v-row class="mb-2" dense>
            <v-col>
                <v-progress-linear
                    class="bg-red-800"
                    rounded
                    height="20"
                    color="#166534"
                    :max="total"
                    :model-value="win"
                >
                    <div class="text-sm">{{ index }}</div>
                    <div v-if="titles" class="text-sm">&nbsp;({{ titles }} <span>{{ titles === 1 ? 'title' : 'titles' }}</span>)</div>
                </v-progress-linear>
            </v-col>
        </v-row>
        <v-divider thickness="3" />
    </div>
</template>