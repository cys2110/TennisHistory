<script setup>
import { computed } from 'vue'

const props = defineProps(['win', 'loss'])

const meter = (value) => {
    return `${(value / (props.win + props.loss)) * 100}`
}

const index = computed(() => {
    const decimal = props.win / (props.win + props.loss)
    return isNaN(decimal) ? 'N/A' : parseFloat(decimal.toFixed(3))
})
</script>

<template>
    <v-row>
        <v-col><v-progress-linear rounded :height="20" color="green-accent-4" class="bg-green-darken-4" reverse :model-value="meter(win)">{{ win }}</v-progress-linear></v-col>
        <v-col cols="3" class="text-center text-subtitle-1 font-weight-bold">
            <slot name="metric"></slot>
            <div class="text-subtitle-2">{{ index }}
                <slot name="titles"></slot>
            </div>
        </v-col>
        <v-col><v-progress-linear rounded :height="20" color="red-accent-1" class="bg-red-darken-4" :model-value="meter(loss)">{{ loss }}</v-progress-linear></v-col>
    </v-row>
</template>