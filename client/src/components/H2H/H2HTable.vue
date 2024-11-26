<script setup>
import { percentage } from '@/utils/functions';

const props = defineProps(['p1', 'p2'])
</script>

<template>
    <a-row>
        <a-col :span="5" class="text-lg">{{ p1.win }}/{{ p1.loss }}</a-col>
        <a-col :span="14" class="text-zinc-400 font-bold text-center text-lg">Win-Loss</a-col>
        <a-col :span="5" class="text-lg text-right">{{ p2.win }}/{{ p2.loss }}</a-col>
    </a-row>
    <a-row>
        <a-col :span="24">
            <a-progress size="small"
                :percent="percentage(percentage(p1.win, p1.win + p1.loss), percentage(p1.win, p1.win + p1.loss) + percentage(p2.win, p2.win + p2.loss))"
                :showInfo="false" strokeColor="#6d28d9" trailColor="#166534" />
        </a-col>
    </a-row>
    <a-row>
        <a-col :span="5" class="text-lg">{{ p1.titles }}</a-col>
        <a-col :span="14" class="text-zinc-400 font-bold text-center text-lg">Titles</a-col>
        <a-col :span="5" class="text-lg text-right">{{ p2.titles }}</a-col>
    </a-row>
    <a-row>
        <a-col :span="24">
            <a-progress size="small" :percent="percentage(p1.titles, p1.titles + p2.titles)" :showInfo="false"
                strokeColor="#6d28d9" trailColor="#166534" />
        </a-col>
    </a-row>
    <a-row>
        <a-col :span="5" class="text-lg">${{ p1.pm_USD }}</a-col>
        <a-col :span="14" class="text-zinc-400 font-bold text-center text-lg">Prize Money</a-col>
        <a-col :span="5" class="text-lg text-right">${{ p2.pm_USD }}</a-col>
    </a-row>
    <a-row>
        <a-col :span="24">
            <a-progress size="small" :percent="percentage(p1.pm_USD, p1.pm_USD + p2.pm_USD)" :showInfo="false"
                strokeColor="#6d28d9" trailColor="#166534" />
        </a-col>
    </a-row>
    <a-row>
        <a-col :span="5" class="text-lg">{{ p1.career_high }}</a-col>
        <a-col :span="14" class="text-zinc-400 font-bold text-center text-lg">Career high</a-col>
        <a-col :span="5" class="text-lg text-right">{{ p2.career_high }}</a-col>
    </a-row>
    <a-row>
        <a-col :span="24">
            <a-progress size="small" :percent="percentage(p1.career_high, p1.career_high + p2.career_high)"
                :showInfo="false" strokeColor="#6d28d9" trailColor="#166534" />
        </a-col>
    </a-row>
</template>