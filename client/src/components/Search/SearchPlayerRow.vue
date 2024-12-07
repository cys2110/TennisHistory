<script setup lang="ts">
import Icon from '@ant-design/icons-vue';
import { encodeName, headshot } from '@/utils/functions';
import { onMounted, shallowRef } from 'vue';

const props = defineProps<{
    player: {
        id: string;
        full_name: string;
        country: { name: string, id: string }
    }
}>();
const { id, full_name, country } = props.player
const selectedFlag = shallowRef(null)

// Import flag icons on mount
onMounted(async () => {
    const countryCode = country.id;
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
            <a-avatar :alt="full_name" :src="headshot(id)" class="border-zinc-300 mx-2" :size="50" />
        </template>
        <template #title>
            <div class="flex">
                <router-link class="hover-link hover:!text-zinc-300 text-left"
                    :to="{ name: 'player', params: { name: encodeName(full_name), id: id } }">{{ full_name
                    }}</router-link>
            </div>
        </template>
        <template #description>
            <div class="flex items-center">
                <Icon v-if="selectedFlag" :component="selectedFlag" class="text-2xl" />
                <div class="ml-3">{{ country.name }}</div>
            </div>
        </template>
    </a-list-item-meta>
</template>