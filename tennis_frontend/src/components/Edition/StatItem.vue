<script setup>
import { computed } from 'vue';

const props = defineProps(['p1', 'p2'])

const meter = computed(() => {
    return (props.p1 / (props.p1 + props.p2)) * 100
})

</script>

<template>
    <v-row>
        <v-col cols="1" class="d-flex align-center justify-center">
            <div :class="{'font-weight-bold': p1 > p2}">{{ p1 }}</div>
        </v-col>
        <v-col>
            <div class="text-center text-uppercase font-weight-bold">
                <slot name="metric"></slot>
            </div>
            <div>
                <v-progress-linear
                    rounded
                    height="20"
                    :model-value="meter"
                    max="100"
                    color="indigo-accent-4"
                    class="bg-green-darken-3"
                ></v-progress-linear>
            </div>
        </v-col>
        <v-col cols="1" class="d-flex align-center justify-center">
            <div :class="{'font-weight-bold': p2 > p1}">{{ p2 }}</div>
        </v-col>
        <v-divider thickness="2"></v-divider>
    </v-row>
</template>