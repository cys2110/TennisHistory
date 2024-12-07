<script setup lang="ts">
import { encodeName } from '@/utils/functions';
import { COLOURS, SURFACES } from '@/utils/variables';
import WinnerScore from '../Global/WinnerScore.vue';
import { H2HMatches, Surface } from '@/utils/types';

const props = defineProps<{
    matches: H2HMatches[]
}>()

const customHeaderCell = () => {
    return { style: { backgroundColor: COLOURS.violet700, textAlign: 'center' } }
}

const columns = [
    { title: 'Year', dataIndex: ['round', 'event'], key: 'year', customHeaderCell },
    { title: 'Winner', dataIndex: ['winner', 'player', 'player'], key: 'winner', customHeaderCell },
    { title: 'Event', dataIndex: ['round', 'event', 'tournament'], key: 'event', customHeaderCell },
    { title: 'Round', dataIndex: ['round', 'round'], key: 'round', customHeaderCell },
    { title: 'Surface', dataIndex: ['round', 'event', 'surface', 'id'], key: 'surface', customHeaderCell },
    { title: 'Score', key: 'score', customHeaderCell }
]
</script>

<template>
    <a-table :columns :data-source="matches" :pagination="false">
        <template #bodyCell="{ column, record, text }">
            <template v-if="column.title === 'Year'">
                <router-link class="hover-link"
                    :to="{ name: 'event', params: { name: encodeName(text.tournament.name), id: text.tournament.id, year: text.year.id, eid: text.id } }">{{
                        text.year.id
                    }}</router-link>
            </template>
            <template v-if="column.title === 'Winner'">
                <router-link class="hover-link"
                    :to="{ name: 'player', params: { name: encodeName(text.full_name), id: text.id } }">{{
                        text.full_name
                    }}</router-link>
            </template>
            <template v-if="column.title === 'Event'">
                <router-link class="hover-link"
                    :to="{ name: 'tournament', params: { name: encodeName(text.name), id: text.id } }">{{
                        text.name }}</router-link>
            </template>
            <template v-if="column.title === 'Surface'">{{ SURFACES[text as Surface] }}</template>
            <template v-if="column.title === 'Score'">
                <router-link class="hover-link"
                    :to="{ name: 'match', params: { name: encodeName(text.tournament.name), id: text.tournament.id, year: text.year.id, eid: text.id, mid: record.match_no } }">
                    <WinnerScore :winner="record.winner" :loser="record.loser" />
                </router-link>
            </template>
        </template>
    </a-table>
</template>