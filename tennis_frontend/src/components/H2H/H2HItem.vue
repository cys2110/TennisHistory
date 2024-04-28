<script setup>
import { computed } from 'vue'

const props = defineProps({
    p1Value: {required: false},
    p2Value: {required: false},
    p1Wins: {required: false},
    p2Wins: {required: false},
    p1Loss: {required: false},
    p2Loss: {required: false},
    currency: {required: false}
})

const meter = computed(() => {
    if (props.p1Value || props.p1Value === 0) {
        return (props.p1Value / (props.p1Value + props.p2Value)) * 100
    } else {
        const p1Percent = (props.p1Wins / (props.p1Wins + props.p1Loss))
        const p2Percent = (props.p2Wins / (props.p2Wins + props.p2Loss))
        return (p1Percent / (p1Percent + p2Percent)) * 100
    }
})

</script>

<template>
    <div class="my-2">
        <div class="d-flex justify-space-between">
            <div v-if="(p1Value || p1Value === 0) && !currency">{{ p1Value }}</div>
            <div v-else-if="!currency">{{ p1Wins }}/{{ p1Loss }}</div>
            <slot name="p1PM"></slot>
            <div>
                <slot name="field"></slot>
            </div>
            <div v-if="(p2Value || p2Value === 0) && !currency">{{ p2Value }}</div>
            <div v-else-if="!currency">{{ p2Wins }}/{{ p2Loss }}</div>
            <slot name="p2PM"></slot>
        </div>
        <div>
            <v-progress-linear
                height="10"
                rounded
                max="100"
                color="indigo-accent-4"
                class="bg-green-darken-3"
                :model-value="meter"
            />
        </div>
    </div>
</template>