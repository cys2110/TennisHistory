<script setup lang="ts">
import { computed } from 'vue';
import type { MatchH2H } from '../interfaces';

const props = defineProps<{
    match: MatchH2H
}>()

const sets = computed(() => [
  { index: 1, s1: props.match.s1p1, s2: props.match.s1p2, t1: props.match.t1p1, t2: props.match.t1p2 },
  { index: 2, s1: props.match.s2p1, s2: props.match.s2p2, t1: props.match.t2p1, t2: props.match.t2p2 },
  { index: 3, s1: props.match.s3p1, s2: props.match.s3p2, t1: props.match.t3p1, t2: props.match.t3p2 },
  { index: 4, s1: props.match.s4p1, s2: props.match.s4p2, t1: props.match.t4p1, t2: props.match.t4p2 },
  { index: 5, s1: props.match.s5p1, s2: props.match.s5p2, t1: props.match.t5p1, t2: props.match.t5p2 }
]);

const getMatchScore = (score1: number, score2: number) => {
    return props.match.p1 === props.match.winner_id ? `${score1}${score2}` : `${score2}${score1}`
}

const getTieBreak = (score1: number, score2: number) => {
    return score1 > score2 ? score2 : score1
}
</script>

<template>
    <div
        v-for="set in sets"
        :key="set.index"
        class="flex"
    >
        {{ set.s1 !== null && set.s2 !== null ? getMatchScore(set.s1, set.s2) : ''}}<sup v-if="set.t1 !== null && set.t2 !== null">{{ getTieBreak(set.t1, set.t2) }}</sup>&nbsp;
    </div>
</template>