<script setup lang="ts">
import Icon from '@ant-design/icons-vue';
import { onMounted, shallowRef } from 'vue';

const props = defineProps<{
    country: { name: string, id: string }
}>();

const { id, name } = props.country
const selectedFlag = shallowRef(null)

// Import flag icons on mount
onMounted(async () => {
    const countryCode = id;
    try {
        const flags: { [key: string]: any } = await import(`@/components/icons/flags`)
        selectedFlag.value = flags[countryCode] || null;
    } catch (error) {
        console.error(`Flag for ${countryCode} not found`, error);
    }
});
</script>

<template>
    <a-list-item-meta>
        <template #avatar>
            <Icon v-if="selectedFlag" :component="selectedFlag" class="text-2xl" />
        </template>
        <template #title>{{ name }}</template>
    </a-list-item-meta>
</template>