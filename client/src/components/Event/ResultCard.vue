<script setup>
import { CheckCircleTwoTone } from '@ant-design/icons-vue';
import { encodeName, formatDate, formatTime, getEntry } from '@/utils/functions';
import { COLOURS } from '@/utils/variables';

const props = defineProps(['match', 'name', 'id', 'eid', 'year'])
</script>

<template>
    <a-card class="h-full flex flex-col justify-between p-1">
        <template #title>
            <div v-if="match.date">{{ formatDate(match.date) }}</div>
            <div v-if="match.court">{{ match.court }}</div>
        </template>
        <template #extra>
            <div v-if="match.duration_mins" class="text-right">{{ formatTime(match.duration_mins) }}</div>
            <div v-if="match.umpire" class="text-right">{{ match.umpire.id }}</div>
        </template>
        <a-row class="mb-2">
            <a-col :span="19">
                <a-row class="items-center">
                    <PlayerRow :player="match.winner.player.player" :entry="getEntry(match.winner.player)" />
                </a-row>
            </a-col>
            <a-col :span="2">
                <CheckCircleTwoTone :twoToneColor="COLOURS.green600" />
            </a-col>
            <a-col :span="3" class="flex">
                <ScoreItem :score="match.winner" />
            </a-col>
        </a-row>
        <a-row class="mt-2">
            <a-col :span="19">
                <a-row class="items-center">
                    <PlayerRow :player="match.loser.player.player" :entry="getEntry(match.loser.player)" />
                </a-row>
            </a-col>
            <a-col :span="2">
                <a-tag v-if="match.loser?.incomplete" :color="COLOURS.red600">{{ match.loser.incomplete }}.</a-tag>
            </a-col>
            <a-col :span="3" class="flex">
                <ScoreItem :score="match.loser" />
            </a-col>
        </a-row>
        <template #actions>
            <a-button type="dashed" :disabled="!!match.incomplete" :ghost="true" shape="round" size="small"
                class="!border-zinc-300 hover:!border-zinc-400">
                <template v-if="!!match.incomplete">Stats</template>
                <template v-else><router-link class="!text-zinc-300 hover:!text-zinc-400"
                        :to="{ name: 'match', params: { mid: match.match_no } }">Stats</router-link></template>
            </a-button>
            <a-button type="dashed" :disabled="match.incomplete === 'B'" :ghost="true" shape="round" size="small"
                class="!border-zinc-300 hover:!border-zinc-400">
                <template v-if="match.incomplete === 'B'">H2H</template>
                <template v-else><router-link class="!text-zinc-300 hover:!text-zinc-400"
                        :to="{ name: 'h2h', params: { p1Name: encodeName(match.winner.player.player.full_name), p1Id: match.winner.player.player.id, p2Name: encodeName(match.loser.player.player.full_name), p2Id: match.loser.player.player.id } }">H2H</router-link></template>
            </a-button>
        </template>
    </a-card>
</template>