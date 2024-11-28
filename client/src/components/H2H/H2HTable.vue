<script setup>
import { formatCurrency, percentage } from '@/utils/functions';
import { COLOURS } from '@/utils/variables';

const props = defineProps(['p1', 'p2'])

const comparisons = [
    { title: 'Win-Loss', p1: `${props.p1.win}/${props.p1.loss}`, p2: `${props.p2.win}/${props.p2.loss}`, percent: percentage(percentage(props.p1.win, props.p1.win + props.p1.loss), percentage(props.p1.win, props.p1.win + props.p1.loss) + percentage(props.p2.win, props.p2.win + props.p2.loss)) },
    { title: 'Titles', p1: props.p1.titles, p2: props.p2.titles, percent: percentage(props.p1.titles, props.p1.titles + props.p2.titles) },
    { title: 'Prize Money', p1: formatCurrency('USD', props.p1.pm_USD), p2: formatCurrency('USD', props.p2.pm_USD), percent: percentage(props.p1.pm_USD, props.p1.pm_USD + props.p2.pm_USD) },
    { title: 'Career High', p1: props.p1.career_high, p2: props.p2.career_high, percent: percentage(props.p1.career_high, props.p1.career_high + props.p2.career_high) },
]
</script>

<template>
    <div v-for="comparison in comparisons" :key="comparison.title">
        <a-row>
            <a-col :span="8" class="text-lg">{{ comparison.p1 }}</a-col>
            <a-col :span="8" class="text-zinc-400 font-bold text-center text-lg">{{ comparison.title }}</a-col>
            <a-col :span="8" class="text-lg text-right">{{ comparison.p2 }}</a-col>
        </a-row>
        <a-row>
            <a-col :span="24">
                <a-progress size="small" :percent="comparison.percent" :showInfo="false"
                    :strokeColor="COLOURS.violet700" :trailColor="COLOURS.green800" />
            </a-col>
        </a-row>
    </div>
</template>