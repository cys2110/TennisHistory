<script setup lang="ts">
import { formatCurrency } from '@/utils/functions';

const props = defineProps<{
    pm: { round: string, pm: number, pts: number }[],
    currency: string
}>()
</script>

<template>
    <v-table class="bg-transparent rounded-xl mb-3" fixed-header hover density="compact">
        <thead class="text-xs text-zinc-300">
            <tr>
                <th class="!bg-indigo-800" />
                <th class="!font-bold text-center !bg-indigo-800">Prize money</th>
                <th class="!font-bold text-center !bg-indigo-800">Points</th>
            </tr>
        </thead>
        <tbody class="text-xs text-zinc-300">
            <tr v-for="row in pm" :key="row.round">
                <td v-if="row.pm || row.pts">{{ row.round }}</td>
                <td v-if="row.pm || row.pts" class="text-center">{{ formatCurrency(currency, row.pm) }}</td>
                <td v-if="row.pm || row.pts" class="text-center">{{ row.pts }}</td>
            </tr>
        </tbody>
    </v-table>
</template>