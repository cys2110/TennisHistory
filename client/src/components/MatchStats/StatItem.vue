<script setup lang="ts">
import { percentage } from '../utils';
const props = defineProps<{
    p1: number,
    p2: number,
    percent?: boolean,
    low?: boolean
}>()
</script>

<template>
    <v-row class="text-zinc-400">
        <v-col cols="2" class="text-center">
            <div :class="{'font-bold': p1 > p2 && !low || p1 < p2 && low}">{{ p1 }}</div>
            <div v-if="percent" :class="{'font-bold': p1 > p2 && !low || p1 < p2 && low}">({{ percentage(p1, p1+p2).toFixed(0) }}%)</div>
        </v-col>
        <v-col>
            <div class="mb-0.5 text-sm text-center">
                <slot name="metric"></slot>
            </div>
            <div>
                <v-progress-linear
                    rounded
                    height="20"
                    :max="p1 + p2"
                    color="#3730a3"
                    class="bg-green-800"
                    :model-value="p1"
                />
            </div>
        </v-col>
        <v-col cols="2" class="text-center">
            <div :class="{'font-bold': p2 > p1 && !low || p2 < p1 && low}">{{ p2 }}</div>
            <div v-if="percent" :class="{'font-bold': p2 > p1 && !low || p2 < p1 && low}">({{ percentage(p2, p1+p2).toFixed(0) }}%)</div>
        </v-col>
        <v-divider thickness="2" />
    </v-row>
</template>