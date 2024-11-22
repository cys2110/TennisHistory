<script setup>
import { formattedDates } from '@/utils/functions';
import { CURRENCIES, SURFACES } from '@/utils/variables';

const cardTheme = { colorBgContainer: "#5b21b6" }

const props = defineProps(['event'])

const statistics = [
    { title: 'Prize Money', value: props.event.pm || '—' },
    { title: 'Total Financial Commitment', value: props.event.tfc || '—' }
]
</script>

<template>
    <a-config-provider :theme="{ components: { Card: cardTheme } }">
        <a-row id="details" justify="space-evenly">
            <a-col :span=6 v-for="stat in statistics" :key="stat.title">
                <a-card>
                    <a-statistic :prefix="CURRENCIES[event.currency] || ''" :title="stat.title" :value="stat.value"
                        class="text-center" />
                </a-card>
            </a-col>
        </a-row>
        <a-descriptions :colon="false" class="my-10 bg-violet-800 rounded" bordered layout="vertical" size="middle">
            <a-descriptions-item label="Sponsor name" class="bg-black">{{
                event.sponsor_name ?? '—'
            }}</a-descriptions-item>
            <a-descriptions-item label="Category" class="bg-black">{{ event.category ?? '—' }}</a-descriptions-item>
            <a-descriptions-item label="Dates" class="bg-black">{{ formattedDates(event.start_date, event.end_date)
                }}</a-descriptions-item>
            <a-descriptions-item label="Surface" class="bg-black">{{ SURFACES[event.surface.id] ?? '—'
                }}</a-descriptions-item>
            <a-descriptions-item label="Venue" class="bg-black">
                <div v-if="event.venue" class="flex flex-col justify-center">
                    <div>{{ event.venue.name ?? '—' }}</div>
                    <div>{{ event.venue.city }}, {{ event.venue.country.name }}</div>
                </div>
                <div v-else>—</div>
            </a-descriptions-item>
            <a-descriptions-item :label="event.supervisors.length === 1 ? 'Supervisor' : 'Supervisors'"
                class="bg-black">
                <div v-if="event.supervisors.length > 0" v-for="supervisor in event.supervisors" :key="supervisor.id">{{
                    supervisor.id }}</div>
                <div v-else>—</div>
            </a-descriptions-item>
        </a-descriptions>
    </a-config-provider>
</template>