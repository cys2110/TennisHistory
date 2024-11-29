<script setup>
import { ref, watch } from 'vue';
import { useQuery } from '@vue/apollo-composable';
import { GET_COUNTRY } from '@/services/MiscService';
import { encodeName, headshot } from '@/utils/functions';

const props = defineProps(['countries'])
const open = ref(false)
const selection = ref(null)
const players = ref(null)

const { query, variables } = GET_COUNTRY(selection.value)
const { result, loading, error, refetch } = useQuery(query, variables)

watch(result, newResult => {
    if (newResult) players.value = newResult.countries[0]
})

watch(error, newError => {
    if (newError) console.error(newError)
})

const handleClick = (country) => {
    selection.value = country
    open.value = true
    refetch({ name: country })
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
    <a-list :data-source="countries" header="Countries">
        <template #renderItem="{ item }">
            <a-list-item class="cursor-pointer" @click="handleClick(item.name)">{{ item.name }}</a-list-item>
        </template>
    </a-list>
    <a-drawer v-if="players" v-model:open="open" @close="handleClose" size="large" class="!bg-violet-800">
        <template #title>Players who have represented {{ selection }}
        </template>
        <a-list v-if="players.players.length > 0" :data-source="players.players" header="Current or retired players">
            <template #renderItem="{ item }">
                <a-list-item>
                    <a-list-item-meta>
                        <template #avatar>
                            <a-avatar :alt="item.full_name" :src="headshot(item.id)" class="border-zinc-300 mx-2" />
                        </template>
                        <template #description>
                            <router-link class="hover-link hover:!text-zinc-300"
                                :to="{ name: 'player', params: getParams(item) }">
                                {{ item.full_name }}
                            </router-link>
                        </template>
                    </a-list-item-meta>
                </a-list-item>
            </template>
        </a-list>
        <a-list v-if="players.formerPlayers.length > 0" :data-source="players.formerPlayers" header="Former players">
            <template #renderItem="{ item }">
                <a-list-item>
                    <a-list-item-meta>
                        <template #avatar>
                            <a-avatar :alt="item.full_name" :src="headshot(item.id)" class="border-zinc-300 mx-2" />
                        </template>
                        <template #description>
                            <router-link class="hover-link hover:!text-zinc-300"
                                :to="{ name: 'player', params: getParams(item) }">
                                {{ item.full_name }}
                            </router-link>
                        </template>
                    </a-list-item-meta>
                </a-list-item>
            </template>
        </a-list>
    </a-drawer>
</template>