<script setup>
import { computed } from 'vue';
import { encodeName } from '@/utils/functions';
import { SURFACES } from '@/utils/variables';

// Variables
const props = defineProps(['events'])
const flattenedEvents = computed(() =>
    props.events.flatMap(({ year, count, events: eventList }) =>
        eventList.map((event, index) => ({
            year: index === 0 ? year : "",
            count: index === 0 ? count : "",
            event,
            rowSpan: index === 0 ? count : 0,
        }))
    )
);

// Table styling
const customHeaderStyle = { style: { backgroundColor: '#5b21b6', textAlign: 'center' } }
const customHeaderCell = () => customHeaderStyle;
const customCell = record => ({ rowSpan: record.rowSpan, align: 'center' });

const columns = [
    {
        title: "Year",
        dataIndex: "year",
        key: "year",
        customCell,
        customHeaderCell
    },
    {
        title: "Total",
        dataIndex: "count",
        key: "count",
        customCell,
        customHeaderCell
    },
    {
        title: "Event",
        dataIndex: "event",
        key: "eventName",
        customHeaderCell
    },
    {
        title: "Surface",
        dataIndex: ["event", "surface"],
        key: "surface",
        customHeaderCell
    },
];

</script>

<template>
    <a-table :columns :data-source="flattenedEvents">
        <template #bodyCell="{ column, record }">
            <template v-if="column.title === 'Event'">
                <router-link class="hover-link"
                    :to="{ name: 'tournament', params: { name: encodeName(record.event.tournament_name), id: record.event.tournament_id } }">{{
                        record.event.tournament_name }}</router-link>
            </template>
            <template v-if="column.title === 'Surface'">{{ SURFACES[record.event.surface] }}</template>
        </template>
    </a-table>
</template>