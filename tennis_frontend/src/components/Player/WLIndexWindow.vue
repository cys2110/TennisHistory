<script setup>
import IndexItem from '@/components/Player/IndexItem.vue';
import PlayerService from '@/services/PlayerService';
import { onMounted, ref } from 'vue';

const props = defineProps(['id'])
const index = ref({})

onMounted(() => {
    PlayerService.getPlayerStats(props.id)
    .then(response => index.value = response.data )
    .catch(error => console.log(error))
})
</script>

<template>
    <v-container>
        <v-row>
            <v-col>
                <div class="text-6">Match Record</div>
            </v-col>
        </v-row>
        <IndexItem :win="index.overall_w" :loss="index.overall_l">
            <template #metric>Overall</template>
            <template #titles> ({{ index.overall_titles }} <span v-if="index.overall_titles === 1">title</span><span v-else>titles</span>)</template>
        </IndexItem>
        <IndexItem :win="index.gs_w" :loss="index.gs_l">
            <template #metric>Grand Slams</template>
            <template #titles> ({{ index.gs_titles }} <span v-if="index.gs_titles === 1">title</span><span v-else>titles</span>)</template>
        </IndexItem>
        <IndexItem :win="index.masters_w" :loss="index.masters_l">
            <template #metric>ATP Masters 1000</template>
            <template #titles> ({{ index.masters_titles }} <span v-if="index.masters_titles === 1">title</span><span v-else>titles</span>)</template>
        </IndexItem>
        <div class="heading index-row">Pressure points</div>
        <IndexItem :win="index.tb_w" :loss="index.tb_l">
            <template #metric>Tiebreaks</template>
        </IndexItem>
        <IndexItem :win="index.v10_w" :loss="index.v10_l">
            <template #metric>Versus Top 10</template>
        </IndexItem>
        <IndexItem :win="index.finals_w" :loss="index.finals_l">
            <template #metric>Finals</template>
        </IndexItem>
        <IndexItem :win="index.deciders_w" :loss="index.deciders_l">
            <template #metric>Deciding set</template>
        </IndexItem>
        <IndexItem :win="index.set5_w" :loss="index.set5_l">
            <template #metric>5th set record</template>
        </IndexItem>
        <div class="heading index-row">Environment</div>
        <IndexItem :win="index.cl_w" :loss="index.cl_l">
            <template #metric>Clay</template>
            <template #titles> ({{ index.cl_titles }} <span v-if="index.cl_titles === 1">title</span><span v-else>titles</span>)</template>
        </IndexItem>
        <IndexItem :win="index.g_w" :loss="index.g_l">
            <template #metric>Grass</template>
            <template #titles> ({{ index.g_titles }} <span v-if="index.g_titles === 1">title</span><span v-else>titles</span>)</template>
        </IndexItem>
        <IndexItem :win="index.h_w" :loss="index.h_l">
            <template #metric>Hard</template>
            <template #titles> ({{ index.h_titles }} <span v-if="index.h_titles === 1">title</span><span v-else>titles</span>)</template>
        </IndexItem>
        <IndexItem :win="index.c_w" :loss="index.c_l">
            <template #metric>Carpet**</template>
            <template #titles> ({{ index.c_titles }} <span v-if="index.c_titles === 1">title</span><span v-else>titles</span>)</template>
        </IndexItem>
        <IndexItem :win="index.i_w" :loss="index.i_l">
            <template #metric>Indoor</template>
            <template #titles> ({{ index.i_titles }} <span v-if="index.i_titles === 1">title</span><span v-else>titles</span>)</template>
        </IndexItem>
        <IndexItem :win="index.o_w" :loss="index.o_l">
            <template #metric>Outdoor</template>
            <template #titles> ({{ index.o_titles }} <span v-if="index.o_titles === 1">title</span><span v-else>titles</span>)</template>
        </IndexItem>
        <div class="heading index-row">Other</div>
        <IndexItem :win="index.l1_w" :loss="index.l1_l">
            <template #metric>After losing 1st set</template>
        </IndexItem>
        <IndexItem :win="index.rh_w" :loss="index.rh_l">
            <template #metric>vs. right-handers</template>
        </IndexItem>
        <IndexItem :win="index.lh_w" :loss="index.lh_l">
            <template #metric>vs. left-handers</template>
        </IndexItem>
    </v-container>
</template>