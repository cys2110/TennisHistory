<script setup>
import { toRefs } from 'vue'
import { formatDate, formattedDates, formatTime } from '@/utils/functions'
import { SURFACES } from '@/utils/variables'

const props = defineProps(['match'])
const { date, round, court, duration_mins, umpire } = toRefs(props.match)
</script>

<template>
  <a-descriptions bordered size="middle" class="my-10 bg-violet-800">
    <a-descriptions-item label="Date(s)" class="bg-black" :span="2">
      <div v-if="date">{{ formatDate(date) }}</div>
      <div v-else>{{ formattedDates(round.event.start_date, round.event.end_date) }}</div>
    </a-descriptions-item>
    <a-descriptions-item label="Surface" class="bg-black">{{
      SURFACES[round.event.surface.id] ?? '—'
    }}</a-descriptions-item>
    <a-descriptions-item label="Court" class="bg-black">{{ court ?? '—' }}</a-descriptions-item>
    <a-descriptions-item label="Duration" class="bg-black">
      <div v-if="duration_mins">{{ formatTime(duration_mins) }}</div>
      <div v-else>—</div>
    </a-descriptions-item>
    <a-descriptions-item label="Umpire" class="bg-black">{{
      umpire?.id ?? '—'
    }}</a-descriptions-item>
  </a-descriptions>
</template>
