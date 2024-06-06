<script setup lang="ts">
import { percentage } from '../utils';

const props = defineProps<{
    metric: string,
    win?: number,
    total: number
}>()
</script>

<template>
    <div class="flex justify-between mb-1 mt-3">
        <div>{{ metric }}</div>
        <div>{{ win ? '' : total }}</div>
    </div>
    <div v-if="win">
        <v-progress-linear
            class="bg-green-800"
            rounded
            height="20"
            color="#16a34a"
            :model-value="percentage(win, total)"
        >
            <div class="text-white text-sm">{{ `${percentage(win, total).toFixed(0)}%` }}</div>
        </v-progress-linear>
    </div>
</template>