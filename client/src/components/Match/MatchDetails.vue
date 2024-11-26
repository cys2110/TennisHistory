<script setup>
import { formatDate, formattedDates, formatTime } from '@/utils/functions';
import { SURFACES } from '@/utils/variables';

const props = defineProps(['match'])
</script>

<template>
    <a-descriptions bordered size="middle" class="my-10 bg-violet-800">
        <a-descriptions-item label="Date(s)" class="bg-black" :span="2">
            <div v-if="match.date">{{ formatDate(match.date) }}</div>
            <div v-else>{{ formattedDates(match.round.event.start_date, match.round.event.end_date) }}</div>
        </a-descriptions-item>
        <a-descriptions-item label="Surface" class="bg-black">{{ SURFACES[match.round.event.surface.id] ?? '—'
            }}</a-descriptions-item>
        <a-descriptions-item label="Court" class="bg-black">{{ match.court ?? '—' }}</a-descriptions-item>
        <a-descriptions-item label="Duration" class="bg-black">
            <div v-if="match.duration_mins">{{ formatTime(match.duration_mins) }}</div>
            <div v-else>—</div>
        </a-descriptions-item>
        <a-descriptions-item label="Umpire" class="bg-black">{{ match.umpire?.id ?? '—' }}</a-descriptions-item>
    </a-descriptions>
</template>