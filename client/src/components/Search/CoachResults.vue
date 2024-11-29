<script setup>
import { ref, watch } from 'vue';
import { useQuery } from '@vue/apollo-composable';
import { GET_COACH } from '@/services/MiscService';
import { encodeName, headshot } from '@/utils/functions';

const props = defineProps(['coaches'])
const open = ref(false)
const selection = ref(null)
const players = ref([])

const { query, variables } = GET_COACH(selection.value)
const { result, loading, error, refetch } = useQuery(query, variables)

watch(result, newResult => {
    if (newResult) players.value = newResult.coaches[0].players
})

watch(error, newError => {
    if (newError) console.error(newError)
})

const handleClick = (coach) => {
    selection.value = coach
    open.value = true
    refetch({ id: coach.id })
}

const handleClose = () => {
    open.value = false
    selection.value = null
}

const getParams = (item) => {
    return {
        name: encodeName(item.full_name),
        id: item.id
    }
}
</script>

<template>
    <a-list :data-source="coaches" header="Coaches">
        <template #renderItem="{ item }">
            <a-list-item class="cursor-pointer" @click="handleClick(item)">{{ item.full_name || item.id
                }}</a-list-item>
        </template>
    </a-list>
    <a-drawer v-if="selection" v-model:open="open" @close="handleClose" size="large" class="!bg-violet-800">
        <template #title>Players coached by
            <router-link v-if="selection.full_name" class="hover-link font-bold"
                :to="{ name: 'player', params: getParams(selection) }">{{
                    selection.full_name }}</router-link>
            <span v-else class="font-bold">{{ selection.id }}</span>
        </template>
        <a-list v-if="players.length > 0" :data-source="players">
            <template #renderItem="{ item }">
                <a-list-item>
                    <a-list-item-meta>
                        <template #avatar>
                            <a-avatar :alt="item.full_name" :src="headshot(item.id)" class="border-zinc-300 mx-2" />
                        </template>
                        <template #title>
                            <router-link class="hover-link hover:!text-zinc-300"
                                :to="{ name: 'player', params: getParams(item) }">
                                {{ item.full_name }}
                            </router-link>
                        </template>
                        <template #description>
                            <div>{{ item.country.name }}</div>
                        </template>
                    </a-list-item-meta>
                </a-list-item>
            </template>
        </a-list>
    </a-drawer>
</template>