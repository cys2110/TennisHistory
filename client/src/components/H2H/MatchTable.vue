<script setup>
import { encodeName } from '@/utils/functions';
import { SURFACES } from '@/utils/variables';
import WinnerScore from '../Global/WinnerScore.vue';

// [TODO: OPTIMISE CODE]
const props = defineProps(['matches'])
console.log(props.matches)

const columns = [
    {
        title: 'Year',
        dataIndex: ['round', 'event', 'year', 'id'],
        key: 'year',
        customHeaderCell: () => {
            return { style: { backgroundColor: '#5b21b6' } }
        }
    },
    {
        title: 'Winner',
        dataIndex: ['winner', 'player', 'player', 'full_name'],
        key: 'winner',
        customHeaderCell: () => {
            return { style: { backgroundColor: '#5b21b6' } }
        }
    },
    {
        title: 'Event',
        dataIndex: ['round', 'event', 'tournament', 'name'],
        key: 'event',
        customHeaderCell: () => {
            return { style: { backgroundColor: '#5b21b6' } }
        }
    },
    {
        title: 'Round',
        dataIndex: ['round', 'round'],
        key: 'round',
        customHeaderCell: () => {
            return { style: { backgroundColor: '#5b21b6' } }
        }
    },
    {
        title: 'Surface',
        dataIndex: ['round', 'event', 'surface', 'id'],
        key: 'surface',
        customHeaderCell: () => {
            return { style: { backgroundColor: '#5b21b6' } }
        }
    },
    {
        title: 'Score',
        dataIndex: ['match_no'],
        key: 'score',
        customHeaderCell: () => {
            return { style: { backgroundColor: '#5b21b6' } }
        }
    }
]
</script>

<template>
    <a-table :columns :data-source="matches" :pagination="false">
        <template #bodyCell="{ column, record }">
            <template v-if="column.title === 'Year'">
                <router-link class="hover-link"
                    :to="{ name: 'event', params: { name: encodeName(record.round.event.tournament.name), id: record.round.event.tournament.id, year: record.round.event.year.id, eid: record.round.event.id } }">{{
                        record.round.event.year.id }}</router-link>
            </template>
            <template v-if="column.title === 'Winner'">
                <router-link class="hover-link"
                    :to="{ name: 'player', params: { name: encodeName(record.winner.player.player.full_name), id: record.winner.player.player.id } }">{{
                        record.winner.player.player.full_name }}</router-link>
            </template>
            <template v-if="column.title === 'Event'">
                <router-link class="hover-link"
                    :to="{ name: 'tournament', params: { name: encodeName(record.round.event.tournament.name), id: record.round.event.tournament.id } }">{{
                        record.round.event.tournament.name }}</router-link>
            </template>
            <template v-if="column.title === 'Surface'">{{ SURFACES[record.round.event.surface.id] }}</template>
            <template v-if="column.title === 'Score'">
                <WinnerScore :winner="record.winner" :loser="record.loser" />
            </template>
        </template>
        <!--[INSERT LINKS TO RESULTS, DRAWS AND MATCH]-->
    </a-table>
</template>