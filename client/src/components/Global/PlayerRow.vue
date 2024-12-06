<script setup>
import { onMounted, shallowRef, toRefs } from 'vue';
import Icon from '@ant-design/icons-vue';
import { encodeName, headshot } from '@/utils/functions';

const props = defineProps(['player', 'entry'])
const { country, full_name, id } = toRefs(props.player)
const selectedFlag = shallowRef(null)


// import flag icons on mount
onMounted(async () => {
    const countryCode = country.value.id;
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
    <a-row class="flex items-center">
        <a-col :span="3">
            <Icon v-if="selectedFlag" class="text-2xl" :component="selectedFlag" />
        </a-col>
        <a-col :span="3">
            <a-avatar :alt="full_name" :src="headshot(id)" class="border-zinc-300 mx-2" />
        </a-col>
        <a-col :span="18" class="text-left px-5">
            <router-link class="hover-link" :to="{ name: 'player', params: { name: encodeName(full_name), id: id } }">
                {{ full_name }}
            </router-link> <small v-if="entry">{{ entry }}</small>
        </a-col>
    </a-row>
</template>