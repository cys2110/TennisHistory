<script setup>
import { computed } from 'vue';
import { encodeName } from '@/utils/functions';
import { SURFACES } from '@/utils/variables';

const props = defineProps(['events'])

const flattenedEvents = computed(() => {
    return props.events.reduce((acc, event) => {
        const { year, count, events: eventList } = event;
        const rows = eventList.map((e, index) => ({
            year: index === 0 ? year : "",
            count: index === 0 ? count : "",
            event: e,
            rowSpan: index === 0 ? count : 0,
        }));
        return acc.concat(rows);
    }, [])
})

const columns = [
    {
        title: "Year",
        dataIndex: "year",
        key: "year",
        customCell: (record) => {
            return { rowSpan: record.rowSpan }
        },
        customHeaderCell: () => {
            return { style: { backgroundColor: '#5b21b6' } }
        }
    },
    {
        title: "Total",
        dataIndex: "count",
        key: "count",
        customCell: (record) => {
            return { rowspan: record.rowSpan }
        },
        customHeaderCell: () => {
            return { style: { backgroundColor: '#5b21b6' } }
        }
    },
    {
        title: "Event Name",
        dataIndex: "event",
        key: "eventName",
        customHeaderCell: () => {
            return { style: { backgroundColor: '#5b21b6' } }
        }
    },
    {
        title: "Surface",
        dataIndex: ["event", "surface"],
        key: "surface",
        customHeaderCell: () => {
            return { style: { backgroundColor: '#5b21b6' } }
        }
    },
];

</script>

<template>
    <!--[FIX SPACING]-->
    <a-table :columns :data-source="flattenedEvents">
        <template #bodyCell="{ column, record }">
            <template v-if="column.title === 'Event Name'">
                <router-link class="hover-link"
                    :to="{ name: 'tournament', params: { name: encodeName(record.event.tournament_name), id: record.event.tournament_id } }">{{
                        record.event.tournament_name }}</router-link>
            </template>
            <template v-if="column.title === 'Surface'">{{ SURFACES[record.event.surface] }}</template>
        </template>
    </a-table>
</template>