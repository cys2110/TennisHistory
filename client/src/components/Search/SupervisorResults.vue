<script setup lang="ts">
import { Ref, ref, watch } from 'vue';
import { useQuery } from '@vue/apollo-composable';
import { GET_SUPERVISOR } from '@/services/MiscService';
import { encodeName } from '@/utils/functions';

const props = defineProps<{
    supervisors: { id: string }[]
}>()

interface Event {
    id: number
    tournament: {
        id: number
        name: string
    }
    year: {
        id: number
    }
    venue: {
        country: {
            id: string
        }
    }
}
const open = ref(false)
const selection: Ref<string | null> = ref(null)
const events: Ref<Event[]> = ref([])

const { query, variables } = GET_SUPERVISOR("Search")
const { result, loading, error, refetch } = useQuery(query, variables)

watch(result, newResult => {
    if (newResult?.supervisors[0]?.events) events.value = newResult.supervisors[0].events
})

watch(error, newError => {
    if (newError) console.error(newError)
})

const handleClick = (supervisor: string) => {
    selection.value = supervisor
    open.value = true
    refetch({ id: supervisor })
}

const handleClose = () => {
    open.value = false
    selection.value = null
}
</script>

<template>
    <a-list :data-source="supervisors" header="Supervisors">
        <template #renderItem="{ item }">
            <a-list-item class="cursor-pointer" @click="handleClick(item.id)">{{ item.id }}</a-list-item>
        </template>
    </a-list>
    <a-drawer v-if="selection" v-model:open="open" @close="handleClose" size="large" class="!bg-violet-800">
        <template #title>Events supervised by {{ selection }}</template>
        <a-list v-if="events.length > 0" :data-source="events">
            <template #renderItem="{ item }">
                <a-list-item>
                    <SearchEventRow :event="item" />
                </a-list-item>
            </template>
        </a-list>
    </a-drawer>
</template>