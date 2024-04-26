<script setup>
import { computed } from 'vue'

const props = defineProps(['p1Value', 'p1Total', 'p2Value', 'p2Total'])

const p1Meter = computed(() => {
    return Math.round((props.p1Value / props.p1Total) * 100)
})

const p2Meter = computed(() => {
    return Math.round((props.p2Value / props.p2Total) * 100)
})
</script>

<template>
    <v-row>
        <v-col>
            <div>
                <div :class="{'font-weight-bold': p1Meter > p2Meter}">
                    {{ p1Value }}/{{ p1Total }}
                </div>
                <div>
                    <v-progress-linear
                        rounded
                        height="20"
                        :model-value="p1Meter"
                        max="100"
                        color="indigo-accent-4"
                        class="bg-indigo-darken-4"
                        reverse
                    >
                        <span :class="{'font-weight-bold': p1Meter > p2Meter}">{{ p1Meter }}%</span>
                    </v-progress-linear>
                </div>
            </div>
        </v-col>
        <v-col cols="2" class="text-center text-uppercase font-weight-bold">
            <slot name="metric"></slot>
        </v-col>
        <v-col>
            <div>
                <div :class="{'font-weight-bold': p2Meter > p1Meter}" class="text-right">{{ p2Value }}/{{ p2Total }}</div>
                <div>
                    <v-progress-linear
                        rounded
                        height="20"
                        :model-value="p2Meter"
                        max="100"
                        color="green-darken-3"
                        class="bg-indigo-darken-4"
                    >
                        <span :class="{'font-weight-bold': p2Meter > p1Meter}">{{ p2Meter }}%</span>
                    </v-progress-linear>
                </div>
            </div>
        </v-col>
        <v-divider thickness="2"></v-divider>
    </v-row>
</template>