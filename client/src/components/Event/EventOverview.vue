<script setup>
import { formattedDates } from '@/utils/functions';
import { CURRENCIES, SURFACES } from '@/utils/variables';

const props = defineProps(['event'])

const statistics = [
    { title: 'Prize Money', value: props.event.pm || '—' },
    { title: 'Total Financial Commitment', value: props.event.tfc || '—' }
]

const descriptionItems = [
    { label: 'Sponsor name', value: props.event.sponsor_name ?? '—' },
    { label: 'Category', value: props.event.category ?? '—' },
    { label: 'Dates', value: formattedDates(props.event.start_date, props.event.end_date) },
    { label: 'Surface', value: SURFACES[props.event.surface.id] ?? '—' }
]
</script>

<template>
    <a-row id="details" justify="space-evenly">
        <a-col :span="6" v-for="stat in statistics" :key="stat.title">
            <a-card>
                <a-statistic :prefix="CURRENCIES[event.currency] || ''" :title="stat.title" :value="stat.value"
                    class="text-center" />
            </a-card>
        </a-col>
    </a-row>
    <a-descriptions :colon="false" class="my-10 bg-violet-800 rounded" bordered layout="vertical" size="middle">
        <a-descriptions-item v-for="item in descriptionItems" :key="item.label" :label="item.label" class="bg-black">
            {{ item.value }}
        </a-descriptions-item>
        <a-descriptions-item label="Venue" class="bg-black">
            <div class="flex flex-col justify-center">
                <div>{{ event.venue?.name ?? '—' }}</div>
                <div v-if="event.venue">{{ event.venue.city }}, {{ event.venue.country.name }}</div>
            </div>
        </a-descriptions-item>
        <a-descriptions-item :label="event.supervisors.length === 1 ? 'Supervisor' : 'Supervisors'" class="bg-black">
            <div v-if="event.supervisors.length > 0" v-for="supervisor in event.supervisors" :key="supervisor.id">{{
                supervisor.id }}</div>
            <div v-else>—</div>
        </a-descriptions-item>
    </a-descriptions>
</template>