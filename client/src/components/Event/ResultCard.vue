<script setup>
import { CheckCircleTwoTone } from '@ant-design/icons-vue';
import { encodeName, formatDate, formatTime, getEntry } from '@/utils/functions';

const cardTheme = { colorBgContainer: "#5b21b6" }
const props = defineProps(['match', 'name', 'id', 'eid', 'year'])
// [TODO: FIX SPACING]
</script>

<template>
    <a-config-provider :theme="{ components: { Card: cardTheme } }">
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
                    <CheckCircleTwoTone twoToneColor="#52c41a" />
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
                    <a-tag v-if="match.loser?.incomplete" color="#f5222d">{{ match.loser.incomplete }}.</a-tag>
                </a-col>
                <a-col :span="3" class="flex">
                    <ScoreItem :score="match.loser" />
                </a-col>
            </a-row>
            <template #actions>
                <!--[TODO: FIX DISABLED]-->
                <a-tag class="mx-auto bg-transparent border-zinc-300" :disabled="match.incomplete === 'B'">
                    <router-link class="!text-zinc-300"
                        :to="{ name: 'match', params: { name: name, id: id, eid: eid, year: year, mid: match.match_no } }">Stats</router-link>
                </a-tag>
                <a-tag class="mx-auto bg-transparent border-zinc-300" :disabled="match.incomplete === 'B'">
                    <router-link class="!text-zinc-300"
                        :to="{ name: 'h2h', params: { p1Name: encodeName(match.winner.player.player.full_name), p1Id: match.winner.player.player.id, p2Name: encodeName(match.loser.player.player.full_name), p2Id: match.loser.player.player.id } }">H2H</router-link>
                </a-tag>
            </template>
        </a-card>
    </a-config-provider>
</template>