<script setup lang="ts">
import { useDisplay } from 'vuetify';
import { DateTime } from 'luxon'
import type { PlayerDetails } from '@/utils/interfaces';
import { convertToFt, plays, percentage, bh, formatCurrency } from '@/utils/functions';
import H2HItem from '@/components/H2H/H2HItem.vue';

const props = defineProps<{
    p1: PlayerDetails
    p2: PlayerDetails
}>()
const { mdAndUp } = useDisplay()
</script>

<template>
    <v-col cols="12" md="4">
        <v-card variant="text">
            <H2HItem v-if="!mdAndUp">
                <template #p1>{{ p1.dob ?
                    DateTime.fromISO(p1.dob).setLocale('gb').toLocaleString(DateTime.DATE_FULL) : 'Unknown'
                    }}</template>
                <template #metric>DOB</template>
                <template #p2>{{ p2.dob ?
                    DateTime.fromISO(p2.dob).setLocale('gb').toLocaleString(DateTime.DATE_FULL) : 'Unknown'
                    }}</template>
            </H2HItem>
            <H2HItem v-if="!mdAndUp">
                <template #p1>{{ p1.height_cm ? `${p1.height_cm} cm
                    (${convertToFt(p1.height_cm)})` : 'Unknown' }}</template>
                <template #metric>Height</template>
                <template #p2>{{ p2.height_cm ? `${p2.height_cm} cm
                    (${convertToFt(p2.height_cm)})` : 'Unknown' }}</template>
            </H2HItem>
            <H2HItem v-if="!mdAndUp">
                <template #p1>{{ p1.rh !== null && p1.rh !== undefined ? plays(p1.rh) : 'Unknown' }}</template>
                <template #metric>Plays</template>
                <template #p2>{{ p2.rh !== null && p2.rh !== undefined ? plays(p2.rh) : 'Unknown' }}</template>
            </H2HItem>
            <H2HItem v-if="!mdAndUp">
                <template #p1>{{ p1.bh1 !== null && p1.bh1 !== undefined ? bh(p1.bh1) : 'Unknown' }}</template>
                <template #metric>Backhand</template>
                <template #p2>{{ p2.bh1 !== null && p2.bh1 !== undefined ? bh(p2.bh1) : 'Unknown' }}</template>
            </H2HItem>
            <H2HItem v-if="!mdAndUp">
                <template #p1>{{ p1.turned_pro?.id }}</template>
                <template #metric>Turned pro</template>
                <template #p2>{{ p2.turned_pro?.id }}</template>
            </H2HItem>
            <H2HItem v-if="p1.win && p1.loss && p2.win && p2.loss"
                :meter="percentage(percentage(p1.win, p1.win + p1.loss), percentage(p1.win, p1.win + p1.loss) + percentage(p2.win, p2.win + p2.loss))">
                <template #p1>{{ p1.win }}/{{ p1.loss }}</template>
                <template #metric>Career win/loss</template>
                <template #p2>{{ p2.win }}/{{ p2.loss }}</template>
            </H2HItem>
            <H2HItem v-if="p1.titles && p2.titles" :meter="percentage(p1.titles, p1.titles + p2.titles)">
                <template #p1>{{ p1.titles }}</template>
                <template #metric>Career titles</template>
                <template #p2>{{ p2.titles }}</template>
            </H2HItem>
            <H2HItem v-if="p1.pm_USD && p2.pm_USD" :meter="percentage(p1.pm_USD, p1.pm_USD + p2.pm_USD)">
                <template #p1>{{ formatCurrency('USD', p1.pm_USD) }}</template>
                <template #metric>Career prize money</template>
                <template #p2>{{ formatCurrency('USD', p2.pm_USD) }}</template>
            </H2HItem>
            <H2HItem v-if="p1.career_high || p2.career_high"
                :meter="p1.career_high && p2.career_high ? percentage(p1.career_high, p1.career_high + p2.career_high) : p1.career_high ? percentage(p1.career_high, 0) : p2.career_high ? percentage(p2.career_high, 0) : percentage(0, 0)">
                <template #p1>{{ p1.career_high ?? '-' }}</template>
                <template #metric>Career high</template>
                <template #p2>{{ p2.career_high ?? '-' }}</template>
            </H2HItem>
        </v-card>
    </v-col>
</template>