<script setup>
const props = defineProps(['p1Kmh', 'p2Kmh', 'p1Mph', 'p2Mph'])
</script>

<template>
    <v-row>
        <v-col cols="2" class="d-flex flex-column align-center justify-center">
            <div :class="{'font-weight-bold': p1Kmh > p2Kmh}">{{ p1Kmh }} km/h</div>
            <div :class="{'font-weight-bold': p1Kmh > p2Kmh}">{{ p1Mph }} mph</div>
        </v-col>
        <v-col>
            <div class="text-center text-uppercase font-weight-bold">
                <slot name="metric"></slot>
            </div>
            <div>
                <v-progress-linear
                    rounded
                    height="20"
                    color="indigo-accent-4"
                    class="bg-green-darken-3"
                    :model-value="p1Kmh"
                    :max="p1Kmh + p2Kmh"
                ></v-progress-linear>
            </div>
        </v-col>
        <v-col cols="2" class="d-flex flex-column align-center justify-center">
            <div :class="{'font-weight-bold': p2Kmh > p1Kmh}">{{ p2Kmh }} km/h</div>
            <div :class="{'font-weight-bold': p2Kmh > p1Kmh}">{{ p2Mph }} mph</div>
        </v-col>
        <v-divider thickness="2"></v-divider>
    </v-row>
</template>