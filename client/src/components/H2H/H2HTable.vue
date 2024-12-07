<script setup lang="ts">
import { formatCurrency, percentage } from '@/utils/functions';
import { H2HPlayerDetails } from '@/utils/types';
import { COLOURS } from '@/utils/variables';

const props = defineProps<{
    p1: H2HPlayerDetails
    p2: H2HPlayerDetails
}>()

type Comparison = {
    title: string;
    p1: string | number;
    p2: string | number;
    percent: number;
};

const comparisons: Comparison[] = [
    { title: 'Win-Loss', p1: `${props.p1.win}/${props.p1.loss}`, p2: `${props.p2.win}/${props.p2.loss}`, percent: percentage(percentage(props.p1.win, props.p1.win + props.p1.loss), percentage(props.p1.win, props.p1.win + props.p1.loss) + percentage(props.p2.win, props.p2.win + props.p2.loss)) },
    { title: 'Titles', p1: props.p1.titles, p2: props.p2.titles, percent: percentage(props.p1.titles, props.p1.titles + props.p2.titles) },
    { title: 'Prize Money', p1: formatCurrency('USD', props.p1.pm_USD), p2: formatCurrency('USD', props.p2.pm_USD), percent: percentage(props.p1.pm_USD, props.p1.pm_USD + props.p2.pm_USD) },
    ...(props.p1.career_high && props.p2.career_high
        ? [
            {
                title: 'Career High',
                p1: props.p1.career_high,
                p2: props.p2.career_high,
                percent: percentage(
                    props.p1.career_high,
                    props.p1.career_high + props.p2.career_high
                ),
            },
        ]
        : []),
]
</script>

<template>
    <div v-for="comparison in comparisons" :key="comparison.title">
        <a-row>
            <a-col :span="8">{{ comparison.p1 }}</a-col>
            <a-col :span="8" class="text-zinc-400 font-bold text-center">{{ comparison.title }}</a-col>
            <a-col :span="8" class="text-right">{{ comparison.p2 }}</a-col>
        </a-row>
        <a-row>
            <a-col :span="24">
                <a-progress size="small" :percent="comparison.percent" :showInfo="false"
                    :strokeColor="COLOURS.violet700" :trailColor="COLOURS.green800" />
            </a-col>
        </a-row>
    </div>
</template>