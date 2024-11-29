<script setup>
import { ref, watch } from 'vue';
import { useQuery } from '@vue/apollo-composable';
import { GET_UMPIRE } from '@/services/MiscService';
import { encodeName } from '@/utils/functions';

const props = defineProps(['umpires'])
const open = ref(false)
const selection = ref(null)
const events = ref([])

const { query, variables } = GET_UMPIRE(selection.value)
const { result, loading, error, refetch } = useQuery(query, variables)

watch(result, newResult => {
    if (newResult) events.value = newResult.events
})

watch(error, newError => {
    if (newError) console.error(newError)
})

const handleClick = (umpire) => {
    selection.value = umpire
    open.value = true
    refetch({ id: umpire })
}

const handleClose = () => {
    open.value = false
    selection.value = null
}

const getParams = (event) => {
    return {
        name: encodeName(event.tournament.name),
        id: event.tournament.id,
        year: event.year.id,
        eid: event.id
    }
}
</script>

<template>
    <a-list :data-source="umpires" header="Umpires">
        <template #renderItem="{ item }">
            <a-list-item class="cursor-pointer" @click="handleClick(item.id)">{{ item.id }}</a-list-item>
        </template>
    </a-list>
    <a-drawer v-if="selection" v-model:open="open" @close="handleClose" size="large" class="!bg-violet-800">
        <template #title>Matches umpired by {{ selection }}</template>
        <a-list v-if="events.length > 0" v-for="event in events" :key="event.id" :data-source="event.rounds">
            <template #header>
                <router-link class="hover-link" :to="{ name: 'event', params: getParams(event) }">
                    {{ event.tournament.name }} {{ event.year.id }}</router-link>
            </template>
            <template #renderItem="{ item }">
                <a-list-item>
                    <a-list-item-meta>
                        <template #title>{{ item.round }}</template>
                        <template #description>
                            <div v-for="match in item.matches" :key="match.match_no" class="ml-5 text-sm my-1">
                                <router-link class="hover-link"
                                    :to="{ name: 'match', params: { ...getParams(event), mid: match.match_no } }">
                                    {{ match.p1.player.player.full_name }} vs. {{ match.p2.player.player.full_name
                                    }}</router-link>
                            </div>
                        </template>
                    </a-list-item-meta>
                </a-list-item>
            </template>
        </a-list>
    </a-drawer>
</template>