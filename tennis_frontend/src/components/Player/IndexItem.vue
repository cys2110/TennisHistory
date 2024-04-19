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
    <div class="index-row">
        <div class="index-meter"><v-progress-linear rounded :height="20" color="green-darken-4" reverse :model-value="meter(win)"><p>{{ win }}</p></v-progress-linear></div>
        <div class="index-component">
            <div class="index-heading">
                <slot name="metric"></slot>
            </div>
            <div class="index-subheading">{{ index }}
                <slot name="titles"></slot>
            </div>
        </div>
        <div class="index-meter"><v-progress-linear rounded :height="20" color="green-darken-4" :model-value="meter(loss)"><p>{{ loss }}</p></v-progress-linear></div>
    </div>
</template>

<style scoped>
p {
    color: #B9F6CA
}

.index-row {
    display: flex;
    flex-direction: row;
    width: 100%;
    align-items: center;
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
}

.index-meter {
    width: 33%;
}

.index-component {
    display: flex;
    flex-direction: column;
    width: 33%
}

.index-heading {
    text-align: center;
    font-weight: bold;
}

.index-subheading {
    text-align: center;
}
</style>