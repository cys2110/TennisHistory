<script setup>
import { CheckCircleTwoTone } from '@ant-design/icons-vue';
import { encodeName, getEntry } from '@/utils/functions';
import { COLOURS } from '@/utils/variables';

const props = defineProps(['match', 'name', 'id', 'eid', 'year'])
</script>

<template>
    <a-card class="my-1">
        <a-row>
            <a-col :span="19">
                <PlayerRow v-if="match.p1" :player="match.p1.player.player" :entry="getEntry(match.p1.player)" />
                <div v-else-if="match.incomplete === 'B'">BYE</div>
                <div v-else>PLAYER 1</div>
            </a-col>
            <a-col :span="2">
                <CheckCircleTwoTone v-if="match.winner.player.player.id === match.p1.player.player.id"
                    :twoToneColor="COLOURS.green600" />
                <a-tag v-if="match.p1.incomplete" :color="COLOURS.red600">{{ match.p1.incomplete }}</a-tag>
            </a-col>
            <a-col :span="3">
                <ScoreItem :score="match.p1" />
            </a-col>
        </a-row>
        <a-row class="mt-5">
            <a-col :span="19">
                <PlayerRow v-if="match.p2" :player="match.p2.player.player" :entry="getEntry(match.p2.player)" />
                <div v-else-if="match.incomplete === 'B'">BYE</div>
                <div v-else>PLAYER 2</div>
            </a-col>
            <a-col :span="2">
                <CheckCircleTwoTone v-if="match.winner.player.player.id === match.p2.player.player.id"
                    :twoToneColor="COLOURS.green600" />
                <a-tag v-if="match.p2.incomplete" :color="COLOURS.red600">{{ match.p2.incomplete }}</a-tag>
            </a-col>
            <a-col :span="3">
                <ScoreItem :score="match.p2" />
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
                        :to="{ name: 'h2h', params: { p1Name: encodeName(match.p1.player.player.full_name), p1Id: match.p1.player.player.id, p2Name: encodeName(match.p2.player.player.full_name), p2Id: match.p2.player.player.id } }">H2H</router-link></template>
            </a-button>
        </template>
    </a-card>
</template>