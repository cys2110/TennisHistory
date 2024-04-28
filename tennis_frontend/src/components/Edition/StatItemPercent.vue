<script setup>
import { computed } from 'vue';

const props = defineProps(['p1Value', 'total'])

const p2Value = props.total - props.p1Value

const p1Percent = computed(() => {
    return Math.floor((props.p1Value / props.total) * 100)
})

const p2Percent = computed(() => {
    return Math.floor((p2Value / props.total) * 100)
})
</script>

<template>
    <v-row>
        <v-col cols="2" class="d-flex flex-column align-center justify-center">
            <div :class="{'font-weight-bold': p1Percent > p2Percent}">{{ p1Value }}</div>
            <div :class="{'font-weight-bold': p1Percent > p2Percent}">({{ p1Percent }}%)</div>
        </v-col>
        <v-col>
            <div class="text-center text-uppercase font-weight-bold">
                <slot name="metric"></slot>
            </div>
            <div>
                <v-progress-linear
                    rounded
                    height="20"
                    :model-value="p1Percent"
                    max="100"
                    color="indigo-accent-4"
                    class="bg-green-darken-3"
                >
                    {{ total }}
                </v-progress-linear>
            </div>
        </v-col>
        <v-col cols="2"  class="d-flex flex-column align-center justify-center">
            <div :class="{'font-weight-bold': p2Percent > p1Percent}">{{ p2Value }}</div>
            <div :class="{'font-weight-bold': p2Percent > p1Percent}">({{ p2Percent }}%)</div>
        </v-col>
        <v-divider thickness="2"/>
    </v-row>
</template>