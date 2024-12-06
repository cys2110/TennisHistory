<script setup>
import { onMounted, shallowRef } from 'vue';
import Icon from '@ant-design/icons-vue';
import { encodeName, headshot } from '@/utils/functions';
import { STATUS_INFO } from '@/utils/variables';

const props = defineProps(['entry'])
const { player, seed, status, rank } = toRefs(props.entry)
const { id, full_name, country } = toRefs(player)
const selectedFlag = shallowRef(null)
const entryInfo = [
    { title: 'Seed', value: seed.value || '—' },
    { title: 'Status', value: STATUS_INFO[status.value] || '—' },
    { title: 'Rank', value: rank.value || '—' }
]

// Import flag icons on mount
onMounted(async () => {
    const countryCode = country.id;
    try {
        selectedFlag.value = (
            await import(`@/components/icons/flags`)
        )[countryCode] || null;
    } catch (error) {
        console.error(`Flag for ${countryCode} not found`, error);
    }
});
</script>

<template>
    <a-card class="full-card pt-5 items-center" :bodyStyle="{ width: '100%' }">
        <template #cover>
            <a-image :alt="full_name" :src="headshot(id)" class="!rounded-full !border-zinc-300 border-[1.5px] !w-28"
                :preview="false" />
        </template>
        <a-card-meta class="text-center">
            <template #title>
                <router-link class="hover-link font-bold text-wrap"
                    :to="{ name: 'player', params: { name: encodeName(full_name), id: id } }">
                    {{ full_name }}
                </router-link>
            </template>
            <template #description>
                <div class="flex items-center justify-center">
                    <Icon v-if="selectedFlag" class="mx-2 text-2xl" :component="selectedFlag" />
                    {{ country.name }}
                </div>
                <div v-for="info in entryInfo" :key="info.title">{{ info.title }}: {{ info.value }}</div>
            </template>
        </a-card-meta>
    </a-card>
</template>