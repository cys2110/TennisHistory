<script setup lang="ts">
import { formatCurrency, percentage } from '@/utils/functions'
import type { Player } from '@/utils/types'

const props = defineProps<{
  p1: Pick<Player, 'bh1' | 'career_high' | 'ch_date' | 'country' | 'dob' | 'full_name' | 'height_cm' | 'id' | 'loss' | 'pm_USD' | 'rh' | 'titles' | 'turned_pro' | 'win'>
  p2: Pick<Player, 'bh1' | 'career_high' | 'ch_date' | 'country' | 'dob' | 'full_name' | 'height_cm' | 'id' | 'loss' | 'pm_USD' | 'rh' | 'titles' | 'turned_pro' | 'win'>
}>()

type Comparison = {
  title: string
  p1: string | number
  p2: string | number
  percent: number
}

const comparisons: Comparison[] = [
  {
    title: 'Win-Loss',
    p1: `${props.p1.win}/${props.p1.loss}`,
    p2: `${props.p2.win}/${props.p2.loss}`,
    percent: percentage(
      percentage(props.p1.win, props.p1.win + props.p1.loss),
      percentage(props.p1.win, props.p1.win + props.p1.loss) +
      percentage(props.p2.win, props.p2.win + props.p2.loss),
    ),
  },
  {
    title: 'Titles',
    p1: props.p1.titles,
    p2: props.p2.titles,
    percent: percentage(props.p1.titles, props.p1.titles + props.p2.titles),
  },
  {
    title: 'Prize Money',
    p1: formatCurrency('USD', props.p1.pm_USD),
    p2: formatCurrency('USD', props.p2.pm_USD),
    percent: percentage(props.p1.pm_USD, props.p1.pm_USD + props.p2.pm_USD),
  },
  ...(props.p1.career_high && props.p2.career_high
    ? [
      {
        title: 'Career High',
        p1: props.p1.career_high,
        p2: props.p2.career_high,
        percent: percentage(props.p1.career_high, props.p1.career_high + props.p2.career_high),
      },
    ]
    : []),
]
</script>

<template>
  <div v-for="comparison in comparisons" :key="comparison.title" class="my-1">
    <div class="flex justify-between items-center">
      <div>{{ comparison.p1 }}</div>
      <div class="font-bold">{{ comparison.title }}</div>
      <div>{{ comparison.p2 }}</div>
    </div>
    <div class="w-full mt-1">
      <ProgressBar v-if="isNaN(comparison.percent)" mode="indeterminate" />
      <ProgressBar v-else :value="comparison.percent" :showValue="false" />
    </div>
  </div>
</template>