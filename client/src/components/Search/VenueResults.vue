<script setup>
import { ref, watch } from 'vue';
import { useQuery } from '@vue/apollo-composable';
import { GET_VENUE } from '@/services/MiscService';
import { encodeName } from '@/utils/functions';

const props = defineProps(['venues'])
const open = ref(false)
const selection = ref(null)
const events = ref([])

const { query, variables } = GET_VENUE(selection.value)
const { result, loading, error, refetch } = useQuery(query, variables)

watch(result, newResult => {
    if (newResult) events.value = newResult.venues[0].events
})

watch(error, newError => {
    if (newError) console.error(newError)
})

const handleClick = (venue) => {
    selection.value = { name: venue.name, city: venue.city }
    open.value = true
    refetch({ name: venue.name, city: venue.city })
}

const handleClose = () => {
    open.value = false
    selection.value = null
}
</script>

<template>
    <a-list :data-source="venues" header="Venues">
        <template #renderItem="{ item }">
            <a-list-item class="cursor-pointer" @click="handleClick(item)">{{ item.name }}, {{ item.city }}, {{
                item.country.name }}</a-list-item>
        </template>
    </a-list>
    <a-drawer v-if="selection" v-model:open="open" @close="handleClose" size="large" class="!bg-violet-800">
        <template #title>Events which took place in {{ selection.name }}, {{ selection.city }}</template>
        <a-list v-if="events.length > 0" :data-source="events">
            <template #renderItem="{ item }">
                <a-list-item>
                    <a-list-item-meta>
                        <template #title>
                            <router-link class="hover-link hover:!text-zinc-300"
                                :to="{ name: 'event', params: { name: encodeName(item.tournament.name), id: item.tournament.id, year: item.year.id, eid: item.id } }">
                                {{ item.tournament.name }} {{ item.year.id }}
                            </router-link>
                        </template>
                    </a-list-item-meta>
                </a-list-item>
            </template>
        </a-list>
    </a-drawer>
</template>