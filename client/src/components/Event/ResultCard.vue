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
            <div class="text-right">{{ match.duration_mins ? formatTime(match.duration_mins) : '0:00' }}</div>
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
                <ScoreItem v-if="match.incomplete !== 'B'" :score="match.winner" />
            </a-col>
        </a-row>
        <a-row class="mt-2">
            <a-col :span="19">
                <a-row class="items-center">
                    <PlayerRow v-if="match.loser?.player" :player="match.loser.player.player"
                        :entry="getEntry(match.loser.player)" />
                    <div v-else class="text-center w-full text-zinc-400">BYE</div>
                </a-row>
            </a-col>
            <a-col :span="2">
                <a-tag v-if="match.loser?.incomplete" :color="COLOURS.red600">{{ match.loser.incomplete }}.</a-tag>
            </a-col>
            <a-col :span="3" class="flex">
                <ScoreItem v-if="match.loser?.player" :score="match.loser" />
            </a-col>
        </a-row>
        <template #actions>
            <div class="flex justify-center">
                <div v-if="!!match.incomplete"
                    class="border-zinc-400 border-[1.5px] rounded-full px-4 border-dashed hover:!text-zinc-400 text-zinc-400 cursor-not-allowed">
                    Stats</div>
                <div v-else class="border-zinc-300 border-[1.5px] rounded-full px-4 border-dashed"><router-link
                        class="!text-zinc-300 hover:!text-zinc-400"
                        :to="{ name: 'match', params: { mid: match.match_no } }">Stats</router-link></div>
            </div>
            <div class="flex justify-center">
                <div v-if="match.incomplete === 'B'"
                    class="border-zinc-400 border-[1.5px] rounded-full px-4 border-dashed hover:!text-zinc-400 text-zinc-400 cursor-not-allowed">
                    H2H</div>
                <div v-else class="border-zinc-300 border-[1.5px] rounded-full px-4 border-dashed"><router-link
                        class="!text-zinc-300 hover:!text-zinc-400"
                        :to="{ name: 'h2h', params: { p1Name: encodeName(match.winner.player.player.full_name), p1Id: match.winner.player.player.id, p2Name: encodeName(match.loser.player.player.full_name), p2Id: match.loser.player.player.id } }">H2H</router-link>
                </div>
            </div>
        </template>
    </a-card>
</template>