<script setup>
import { ref, watch } from 'vue';
import { CheckCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons-vue";
import { SHORT_ROUNDS } from '@/utils/variables';
import { encodeName, flag, headshot } from '@/utils/functions';

const props = defineProps(['event', 'match', 'id', 'name'])
const player = ref(null)
const opponent = ref(null)

watch(() => props.match, () => {
    if (props.match.p1?.player) {
        player.value = props.match.p2
        opponent.value = props.match.p1
    } else {
        player.value = props.match.p1
        opponent.value = props.match.p2
    }
}, { immediate: true })
</script>

<template>
    <a-row>
        <!--[TODO: FIX STYLING]-->
        <a-col :span="1">{{ SHORT_ROUNDS[match.round.round] }}</a-col>
        <a-col :span="1">
            <a-image v-if="opponent?.player" :alt="opponent.player.player.country.name"
                :src="flag(opponent.player.player.country.id)" class="rounded" />
        </a-col>
        <a-col :span="2">
            <a-avatar v-if="opponent?.player" :alt="opponent.player.player.full_name"
                :src="headshot(opponent.player.player.id)" class="border-zinc-300 mx-2" />
        </a-col>
        <a-col :span="10">
            <div v-if="match.incomplete === 'B'">BYE</div>
            <router-link v-else class="hover-link"
                :to="{ name: 'player', params: { name: encodeName(opponent.player.player.full_name), id: opponent.player.player.id } }">{{
                    opponent.player.player.full_name }}</router-link>
        </a-col>
        <a-col :span="1">
            <div v-if="opponent?.player">{{ opponent.player.rank }}</div>
        </a-col>
        <a-col :span="1">
            <CheckCircleTwoTone v-if="match.winner.player.player.id === id" twoToneColor="#52c41a" />
            <CloseCircleTwoTone v-else twoToneColor="#b91c1c" />
        </a-col>
        <a-col :span="5">
            <router-link v-if="opponent?.player" class="hover-link"
                :to="{ name: 'match', params: { name: encodeName(event.tournament.name), id: event.tournament.id, year: event.year.id, eid: event.id, mid: match.match_no } }">
                <WinnerScore :winner="player" :loser="opponent" />
            </router-link>
        </a-col>
        <a-col :span="3">
            <router-link v-if="opponent?.player" class="hover-link"
                :to="{ name: 'h2h', params: { p1Name: name, p1Id: id, p2Name: encodeName(opponent.player.player.full_name), p2Id: opponent.player.player.id } }">H2H</router-link>
        </a-col>
    </a-row>
</template>