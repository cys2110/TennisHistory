<script setup>
import { getLowerTb } from '@/utils/functions';
import { INCOMPLETES } from '@/utils/variables';

const props = defineProps(['winner', 'loser'])
</script>

<template>
    <div class="text-zinc-300">
        {{ winner.s1 ? `${winner.s1}${loser.s1}` : '' }}<sup v-if="winner.t1">{{ getLowerTb(winner.t1, loser.t1)
            }}</sup>
        {{ winner.s2 ? `${winner.s2}${loser.s2}` : '' }}<sup v-if="winner.t2">{{ getLowerTb(winner.t2, loser.t2)
            }}</sup>
        {{ winner.s3 ? `${winner.s3}${loser.s3}` : '' }}<sup v-if="winner.t3">{{ getLowerTb(winner.t3, loser.t3)
            }}</sup>
        {{ winner.s4 ? `${winner.s4}${loser.s4}` : '' }}<sup v-if="winner.t4">{{ getLowerTb(winner.t4, loser.t4)
            }}</sup>
        {{ winner.s5 ? `${winner.s5}${loser.s5}` : '' }}<sup v-if="winner.t5">{{ getLowerTb(winner.t5, loser.t5)
            }}</sup>
        {{ loser.incomplete ? INCOMPLETES[loser.incomplete] : "" }}
    </div>
</template>