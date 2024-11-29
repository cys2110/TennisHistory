<script setup>
import { CheckCircleTwoTone } from '@ant-design/icons-vue';
import { getEntry } from '@/utils/functions';
import { COLOURS } from '@/utils/variables';

const props = defineProps(['p1', 'p2', 'winner'])
</script>

<template>
    <a-config-provider :theme="{ components: { Card: { colorBgContainer: 'transparent' } } }">
        <a-card class="border-zinc-500">
            <a-row class="mb-2">
                <a-col :span="15">{{ p1.player.player.full_name }}</a-col>
                <a-col :span="2"><small>{{ getEntry(p1.player) }}</small></a-col>
                <a-col :span="2">
                    <CheckCircleTwoTone v-if="p1.player.player.id === winner" :twoToneColor="COLOURS.green600" />
                    <a-tag v-if="p1.incomplete" :color="COLOURS.red600">{{ p1.incomplete }}.</a-tag>
                </a-col>
                <a-col :span="5" class="flex justify-end">
                    <ScoreItem :score="p1" />
                </a-col>
            </a-row>
            <a-row class="mt-2">
                <a-col :span="15">{{ p2.player.player.full_name }}</a-col>
                <a-col :span="2"><small>{{ getEntry(p2.player) }}</small></a-col>
                <a-col :span="2">
                    <CheckCircleTwoTone v-if="p2.player.player.id === winner" :twoToneColor="COLOURS.green600" />
                    <a-tag v-if="p2.incomplete" :color="COLOURS.red600">{{ p2.incomplete }}.</a-tag>
                </a-col>
                <a-col :span="5" class="flex justify-end">
                    <ScoreItem :score="p2" />
                </a-col>
            </a-row>
        </a-card>
    </a-config-provider>
</template>