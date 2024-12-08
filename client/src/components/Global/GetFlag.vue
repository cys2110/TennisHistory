<script setup lang="ts">
import { onMounted, shallowRef } from 'vue'
import Icon from '@ant-design/icons-vue'

const props = defineProps<{ country: string }>()

const selectedFlag = shallowRef(null)
onMounted(async () => {
    const countryCode = props.country
    try {
        const flags: { [key: string]: any } = await import(`@/components/icons/flags`)
        selectedFlag.value = flags[countryCode] || null
    } catch (error) {
        console.error(`Flag for ${countryCode} not found`, error)
    }
})
</script>

<template>
    <Icon v-if="selectedFlag" class="text-2xl" :component="selectedFlag" />
</template>