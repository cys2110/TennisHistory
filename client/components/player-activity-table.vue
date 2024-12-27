<script setup>
import { useChangeCase } from '@vueuse/integrations';

const props = defineProps(['event', 'year'])
const route = useRoute()
const id = ref(route.params.pid)
const name = ref(route.params.pname)

const columns = [
    { key: 'round', label: 'Round' },
    { key: 'country' },
    { key: 'id' },
    { key: 'name', label: 'Player' },
    { key: 'rank', label: 'Rank' },
    { key: 'winner' },
    { key: 's1', label: 'Score' },
    { key: 's2' }

]
</script>

<template>
    <u-table :rows="event.matches" :columns
        :ui="{ td: { size: 'text-base', color: 'text-zinc-300', padding: 'py-2', base: 'text-center' }, th: { padding: 'py-2', base: 'text-left' } }"
        class="mx-auto w-fit">
        <template #round-data="{ row }">
            {{ SHORT_ROUNDS[row.round] }}
        </template>
        <template #country-data="{ row }">
            <Icon v-if="row.name && getCountryCode(row.country)"
                :name="`flag:${getCountryCode(row.country).toLowerCase()}-4x3`" class="text-base" />
            <component v-else :is="`Icons${row.country}`" />
        </template>
        <template #id-data="{ row }">
            <Avatar v-if="row.name" :image="`https://www.atptour.com/-/media/alias/player-headshot/${row.id}`"
                shape="circle" />
        </template>
        <template #name-data="{ row }">
            <div v-if="row.name" class="flex gap-2">
                <NuxtLink class="hover-link"
                    :to="{ name: 'player', params: { pid: row.id, pname: useChangeCase(row.name, 'snakeCase').value } }">
                    {{
                        row.name }}</NuxtLink>
                <small v-if="row.seed || row.status">({{ row.seed }}{{ row.status }})</small>
            </div>
            <div v-else-if="row.incomplete === 'B'" class="text-center">BYE</div>
            <div v-else>TBD</div>
        </template>
        <template #winner-data="{ row }">
            <Icon v-if="row.winner === row.id" name="charm:circle-cross" class="text-red-600" />
            <Icon v-else-if="row.winner" name="ic:twotone-check-circle" class="text-green-600" />
        </template>
        <template #s1-data="{ row }">
            <NuxtLink v-if="row.name" class="hover-link flex gap-1"
                :to="{ name: 'match', params: { tname: useChangeCase(event.name, 'snakeCase'), tid: event.tid, year: year, eid: event.eid, mid: row.match_no } }">
                <span v-if="row.s1">
                    {{ row.s1 }}<sup v-if="row.t1">{{ row.t1 }}</sup>
                </span>
                <span v-if="row.s2">
                    {{ row.s2 }}<sup v-if="row.t2">{{ row.t2 }}</sup>
                </span>
                <span v-if="row.s3">
                    {{ row.s3 }}<sup v-if="row.t3">{{ row.t3 }}</sup>
                </span>
                <span v-if="row.s4">
                    {{ row.s4 }}<sup v-if="row.t4">{{ row.t4 }}</sup>
                </span>
                <span v-if="row.s5">
                    {{ row.s5 }}<sup v-if="row.t5">{{ row.t5 }}</sup>
                </span>
            </NuxtLink>
        </template>
        <template #s2-data="{ row }">
            <u-button v-if="row.name" label="H2H" variant="outline" size="sm"
                icon="i-material-symbols-swords-outline-rounded"
                :to="`/h2h/${name}-v-${useChangeCase(row.name, 'snakeCase').value}/${id}-${row.id}`"
                :ui="{ rounded: 'rounded-lg' }" />
        </template>
    </u-table>
</template>

<style scoped>
:deep(thead) {
    @apply bg-violet-800;
}

:deep(th > span) {
    @apply font-bold text-base text-zinc-400;
}
</style>