<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { useDisplay } from 'vuetify';
import * as functions from '../utils';
import type { EditionDetails, MatchScore, Player } from '../interfaces';

const props = defineProps<{
    edition: EditionDetails,
    match: MatchScore,
    name: string,
    id: string
}>()
const { xl } = useDisplay()

const winner: Ref<Player | null> = ref(null)
const loser: Ref<Player | null> = ref(null)
const winEntry: Ref< {seed: number | null, status: string | null} | null> = ref(null)
const loseEntry: Ref< {seed: number | null, status: string | null} | null> = ref(null)

if (props.match.player1 && props.match.winner_id === props.match.player1.id) {
    winner.value = props.match.player1
    winEntry.value = props.match.entry1
    if (props.match.incomplete !== 'B') {
        loser.value = props.match.player2
        loseEntry.value = props.match.entry2
    }
} else {
    winner.value = props.match.player2
    winEntry.value = props.match.entry2
    if (props.match.incomplete !== 'B') {
        loser.value = props.match.player1
        loseEntry.value = props.match.entry1
    }
}

const p1Scores = [
    { set: props.match.s5p1 ?? '', tb: props.match.t5p1 ?? ''},
    { set: props.match.s4p1 ?? '', tb: props.match.t4p1 ?? ''},
    { set: props.match.s3p1 ?? '', tb: props.match.t3p1 ?? ''},
    { set: props.match.s2p1 ?? '', tb: props.match.t2p1 ?? ''},
    { set: props.match.s1p1 ?? '', tb: props.match.t1p1 ?? ''}
]
const p2Scores = [
    { set: props.match.s5p2 ?? '', tb: props.match.t5p2 ?? ''},
    { set: props.match.s4p2 ?? '', tb: props.match.t4p2 ?? ''},
    { set: props.match.s3p2 ?? '', tb: props.match.t3p2 ?? ''},
    { set: props.match.s2p2 ?? '', tb: props.match.t2p2 ?? ''},
    { set: props.match.s1p2 ?? '', tb: props.match.t1p2 ?? ''}
]
</script>

<template>
    <short-card class="my-5 mx-2 text-zinc-300 text-xs sm:w-1/2 lg:w-2/5">
        <v-container>
            <v-row>
                <v-col v-if="match.date">{{ functions.formatDate(match.date) }}</v-col>
                <v-col
                    v-if="match.duration_mins"
                    class="text-right"
                    cols="3"
                >
                    {{ functions.formatTime(match.duration_mins) }}
                </v-col>
            </v-row>
            <v-row dense class="py-2">
                <v-col
                    v-if="winner"
                    class="flex items-center"
                    :cols="match.incomplete === 'WO' || match.incomplete === 'R' || match.incomplete === 'D' ? 6 : 8"
                >
                    <div class="mx-0.5">
                        <flag-img
                            class="w-[1rem] lg:w-[2rem]"
                            :src="functions.flagSrc(winner.country)"
                            :alt="winner.country"
                        />
                    </div>
                    <div class="mx-0.5">
                        <v-avatar :size="xl ? 'small' : 'x-small'">
                            <v-img
                                :src="functions.headshot(winner.id)"
                                :alt="winner.full_name"
                            />
                        </v-avatar>
                    </div>
                    <div class="mx-0.5">
                        <router-link
                            class="hover-link"
                            :to="{name: 'Player', params: {name: functions.encodeName(winner.full_name), id: winner.id}}"
                        >
                            {{ winner.full_name }}
                        </router-link>
                        <small
                            v-if="winEntry?.seed || winEntry?.status"
                            class="text-[8px] xl:text-[10px]"
                        >
                            &nbsp;{{ functions.status(winEntry.seed, winEntry.status) }}
                        </small>
                    </div>
                </v-col>
                <v-col
                    class="flex items-center"
                    cols="1"
                >
                    <v-icon
                        class="text-green-500 text-xs"
                        icon="fad fa-check"
                    />
                </v-col>
                <v-col
                    class="flex flex-row-reverse items-center"
                    cols="3"
                >
                    <div
                        v-if="match.player1 && match.winner_id === match.player1.id"
                        v-for="score in p1Scores"
                        :key="score.set"
                    >
                        {{ score.set }}<sup>{{ score.tb }}</sup>&nbsp;
                    </div>
                    <div
                        v-else
                        v-for="score in p2Scores"
                        :key="score.tb"
                    >
                        {{ score.set }}<sup>{{ score.tb }}</sup>&nbsp;
                    </div>
                </v-col>
                <v-col 
                    v-if="match.incomplete === 'R' || match.incomplete === 'WO' || match.incomplete === 'D'"
                    cols="2"
                />
            </v-row>
            <v-row dense>
                <v-col
                    v-if="loser"
                    class="flex items-center"
                    :cols="match.incomplete === 'WO' || match.incomplete === 'R' || match.incomplete === 'D' ? 5 : 8"
                >
                    <div class="mx-0.5">
                        <flag-img
                            class="w-[1rem] lg:w-[2rem]"
                            :src="functions.flagSrc(loser.country)"
                            :alt="loser.country"
                        />
                    </div>
                    <div class="mx-0.5">
                        <v-avatar :size="xl ? 'small' : 'x-small'">
                            <v-img
                                :src="functions.headshot(loser.id)"
                                :alt="loser.full_name"
                            />
                        </v-avatar>
                    </div>
                    <div class="mx-0.5">
                        <router-link
                            class="hover-link"
                            :to="{name: 'Player', params: {name: functions.encodeName(loser.full_name), id: loser.id}}"
                        >
                            {{ loser.full_name }}
                        </router-link>
                        <small
                            v-if="winEntry?.seed || winEntry?.status"
                            class="text-[8px] xl:text-[10px]"
                        >
                            &nbsp;{{ functions.status(winEntry.seed, winEntry.status) }}
                        </small>
                    </div>
                </v-col>
                <v-col v-else>BYE</v-col>
                <v-col cols="1"></v-col>
                <v-col
                    class="flex flex-row-reverse items-center"
                    cols="3"
                >
                    <div
                        v-if="match.player2 && match.winner_id === match.player2.id"
                        v-for="score in p1Scores"
                        :key="score.set"
                    >
                        {{ score.set }}<sup>{{ score.tb }}</sup>&nbsp;
                    </div>
                    <div
                        v-else
                        v-for="score in p2Scores"
                        :key="score.tb"
                    >
                        {{ score.set }}<sup>{{ score.tb }}</sup>&nbsp;
                    </div>
                </v-col>
                <v-col
                    v-if="match.incomplete === 'R' || match.incomplete === 'WO' || match.incomplete === 'D'"
                    class="flex items-center justify-center"
                    cols="2"
                >
                    {{ match.incomplete }}.
                </v-col>
            </v-row>
            <v-row v-if="match.incomplete !== 'B'">
                <v-col>{{ match.umpire ?? '' }}</v-col>
                <v-col class="flex justify-end">
                    <v-chip
                        v-if="match.incomplete !== 'B'"
                        class="mx-1"
                        :to="{name: 'H2H', params: {p1Name: functions.encodeName(match.player1.full_name), p1Id: match.player1.id, p2Name: functions.encodeName(match.player2.full_name), p2Id: match.player2.id}}"
                        :size="xl ? 'small' : 'x-small'"
                    >
                        H2H
                    </v-chip>
                    <v-chip
                        v-if="match.incomplete !=='B' && match.incomplete !== 'WO'"
                        class="mx-1"
                        :to="{name: 'MatchStats', params: {name: name, id: id, editionNo: edition.edition_no, matchId: match.id, p1: functions.encodeName(match.player1.full_name), p2: functions.encodeName(match.player2.full_name)}}"
                        :size="xl ? 'small' : 'x-small'"
                    >
                        Match Stats
                    </v-chip>
                </v-col>
            </v-row>
        </v-container>
    </short-card>
</template>