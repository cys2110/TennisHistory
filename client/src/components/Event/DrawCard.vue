<script setup>
import { CheckCircleTwoTone } from '@ant-design/icons-vue';
import { encodeName, getEntry } from '@/utils/functions';

const cardTheme = { colorBgContainer: "#5b21b6" }
const props = defineProps(['match', 'name', 'id', 'eid', 'year'])
</script>

<template>
    <a-config-provider :theme="{ components: { Card: cardTheme } }">
        <a-card>
            <a-row>
                <a-col :span="19">
                    <a-row v-if="match.p1" class="items-center">
                        <PlayerRow :player="match.p1.player.player" :entry="getEntry(match.p1.player)" />
                    </a-row>
                    <div v-else-if="match.incomplete === 'B'">BYE</div>
                    <div v-else>PLAYER 1</div>
                </a-col>
                <a-col :span="2">
                    <CheckCircleTwoTone v-if="match.winner.player.player.id === match.p1.player.player.id"
                        twoToneColor="#52c41a" />
                    <a-tag v-if="match.p1.incomplete" color="#f5222d">{{ match.p1.incomplete }}</a-tag>
                </a-col>
                <a-col :span="3">
                    <ScoreItem :score="match.p1" />
                </a-col>
            </a-row>
            <a-row>
                <a-col :span="19">
                    <a-row v-if="match.p2" class="items-center">
                        <PlayerRow :player="match.p2.player.player" :entry="getEntry(match.p2.player)" />
                    </a-row>
                    <div v-else-if="match.incomplete === 'B'">BYE</div>
                    <div v-else>PLAYER 2</div>
                </a-col>
                <a-col :span="2">
                    <CheckCircleTwoTone v-if="match.winner.player.player.id === match.p2.player.player.id"
                        twoToneColor="#52c41a" />
                    <a-tag v-if="match.p2.incomplete" color="#f5222d">{{ match.p2.incomplete }}</a-tag>
                </a-col>
                <a-col :span="3">
                    <ScoreItem :score="match.p2" />
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
                        :to="{ name: 'h2h', params: { p1Name: encodeName(match.p1.player.player.full_name), p1Id: match.p1.player.player.id, p2Name: encodeName(match.p2.player.player.full_name), p2Id: match.p2.player.player.id } }">H2H</router-link>
                </a-tag>
            </template>
        </a-card>
    </a-config-provider>
</template>