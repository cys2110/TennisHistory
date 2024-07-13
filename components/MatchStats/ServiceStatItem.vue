<script setup lang="ts">
const props = defineProps<{
    p1kph: number,
    p2kph: number,
    p1mph: number,
    p2mph: number
}>()
</script>

<template>
    <v-row class="text-zinc-400 text-sm text-center">
        <v-col
            class="text-xs md:text-sm"
            cols="3"
            sm="2"
        >
            <div :class="{'font-bold': p1kph > p2kph}">{{ p1kph }} km/h</div>
            <div :class="{'font-bold': p1kph > p2kph}">({{ p1mph }} mph)</div>
        </v-col>
        <v-col>
            <div class="mb-0.5">
                <slot name="metric"></slot>
            </div>
            <div>
                <v-progress-linear
                    class="bg-green-800"
                    rounded
                    height="20"
                    :max="p1kph + p2kph"
                    color="#3730a3"
                    :model-value="p1kph"
                >
                </v-progress-linear>
            </div>
        </v-col>
        <v-col
            class="text-xs md:text-sm"
            cols="3"
            sm="2"
        >
            <div :class="{'font-bold': p2kph > p1kph}">{{ p2kph }} km/h</div>
            <div :class="{'font-bold': p2kph > p1kph}">({{ p2mph }} mph)</div>
        </v-col>
        <v-divider thickness="2" />
    </v-row>
</template>