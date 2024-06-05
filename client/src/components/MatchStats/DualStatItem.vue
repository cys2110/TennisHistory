<script setup lang="ts">
import { percentage } from '../utils';
const props = defineProps<{
    p1Value: number,
    p1Total: number,
    p2Value: number,
    p2Total: number
}>()
</script>

<template>
    <v-row class="text-zinc-400">
        <v-col>
            <div>
                <div class="text-sm text-left mb-0.5">{{ p1Value }}/{{ p1Total }}</div>
                <div>
                    <v-progress-linear
                        rounded
                        height="20"
                        :max="p1Total"
                        color="#3730a3"
                        class="bg-green-800"
                        :model-value="p1Value"
                    >
                        <span class="text-sm">{{ percentage(p1Value, p1Total).toFixed(0) }}%</span>
                    </v-progress-linear>
                </div>
            </div>
        </v-col>
        <v-col cols="3" class="text-sm text-center">
            <slot name="metric"></slot>
        </v-col>
        <v-col>
            <div>
                <div class="text-sm text-right mb-0.5">{{ p2Value }}/{{ p2Total }}</div>
                <div>
                    <v-progress-linear
                        rounded
                        height="20"
                        :max="p2Total"
                        color="#166534"
                        class="bg-indigo-800"
                        :model-value="p2Value"
                    >
                        <span class="text-sm">{{ percentage(p2Value, p2Total).toFixed(0) }}%</span>
                    </v-progress-linear>
                </div>
            </div>
        </v-col>
        <v-divider thickness="2"/>
    </v-row>
</template>