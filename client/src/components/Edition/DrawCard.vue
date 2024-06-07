<script setup lang="ts">
import { headshot, flagSrc, encodeName, status } from '../utils';
import type { EditionDetails, MatchScore } from '../interfaces';

const props = defineProps<{
    edition: EditionDetails,
    match: MatchScore,
    name: string,
    id: string
}>()

const p1Scores = [
    { set: props.match.s5p1 || '', tie: props.match.t5p1 || '' },
    { set: props.match.s4p1 || '', tie: props.match.t4p1 || '' },
    { set: props.match.s3p1 || '', tie: props.match.t3p1 || '' },
    { set: props.match.s2p1 || '', tie: props.match.t2p1 || '' },
    { set: props.match.s1p1 || '', tie: props.match.t1p1 || '' }
]

const p2Scores = [
    { set: props.match.s5p2 || '', tie: props.match.t5p2 || '' },
    { set: props.match.s4p2 || '', tie: props.match.t4p2 || '' },
    { set: props.match.s3p2 || '', tie: props.match.t3p2 || '' },
    { set: props.match.s2p2 || '', tie: props.match.t2p2 || '' },
    { set: props.match.s1p2 || '', tie: props.match.t1p2 || '' }
]
</script>

<template>
    <short-card
        v-if="match"
        class="my-3"
    >
        <v-container class="text-[12px]">
            <v-row>
                <v-col
                    class="flex items-center"
                    :cols="match.incomplete === 'WO' || match.incomplete === 'R' || match.incomplete === 'D' ? 6 : 8"
                >
                    <div
                        v-if="match.player1"
                        class="mx-0.5"
                    >
                        <flag-img
                            class="w-[2rem]"
                            :src="flagSrc(match.player1.country)"
                            :alt="match.player1.country"
                        />
                    </div>
                    <div
                        v-if="match.player1"
                        class="mx-0.5"
                    >
                        <v-avatar size="small">
                            <v-img
                                :src="headshot(match.player1.id)"
                                :alt="match.player1.full_name"
                            />
                        </v-avatar>
                    </div>
                    <div
                        v-if="match.player1"
                        class="mx-0.5"
                    >
                        <router-link
                            class="hover-link"
                            :to="{name: 'Player', params: {name: encodeName(match.player1.full_name), id: match.player1.id}}"
                        >
                            {{ match.player1.full_name }}
                        </router-link>
                        <small
                            v-if="match.entry1.seed || match.entry1.status"
                        >
                            &nbsp;{{ status(match.entry1.seed, match.entry1.status) }}
                        </small>
                    </div>
                    <div v-else-if="match.incomplete">BYE</div>
                    <div v-else>Player 1</div>
                </v-col>
                <v-col
                    class="flex items-center"
                    cols="1"
                >
                    <v-icon
                        v-if="match.winner_id === match.player1.id"
                        class="text-green-500 text-[12px]"
                        icon="fad fa-check"
                    />
                </v-col>
                <v-col
                    class="flex flex-row-reverse items-center"
                    cols="3"
                >
                    <div
                        v-for="score in p1Scores"
                        :key="score.set"
                    >
                        {{ score.set }}<sup>{{ score.tie }}</sup>&nbsp;
                    </div>
                </v-col>
                <v-col
                    v-if="match.incomplete === 'R' || match.incomplete === 'WO' || match.incomplete === 'D'"
                    class="flex items-center"
                    cols="2"
                >
                    {{ match.winner_id === match.player2.id ? `${match.incomplete}.` : '' }}
                </v-col>
            </v-row>
            <v-row>
                <v-col
                    class="flex items-center"
                    :cols="match.incomplete === 'WO' || match.incomplete === 'R' || match.incomplete === 'D' ? 6 : 8"
                >
                    <div
                        v-if="match.player2"
                        class="mx-1"
                    >
                        <flag-img
                            class="w-[1rem]"
                            :src="flagSrc(match.player2.country)"
                            :alt="match.player2.country"
                        />
                    </div>
                    <div
                        v-if="match.player2"
                        class="mx-0.5"
                    >
                        <v-avatar size="small">
                            <v-img
                                :src="headshot(match.player2.id)"
                                :alt="match.player2.full_name"
                            />
                        </v-avatar>
                    </div>
                    <div
                        v-if="match.player2"
                        class="mx-0.5"
                    >
                        <router-link
                            class="hover-link"
                            :to="{name: 'Player', params: {name: encodeName(match.player2.full_name), id: match.player2.id}}"
                        >
                            {{ match.player2.full_name }}
                        </router-link>
                        <small
                            v-if="match.entry2.seed || match.entry2.status"
                        >
                            &nbsp;{{ status(match.entry2.seed, match.entry2.status) }}
                        </small>
                    </div>
                    <div v-else-if="match.incomplete">BYE</div>
                    <div v-else>Player 2</div>
                </v-col>
                <v-col
                    class="flex items-center"
                    cols="1"
                >
                    <v-icon
                        v-if="match.winner_id === match.player2.id"
                        class="text-green-500 text-[12px]"
                        icon="fad fa-check"
                    />
                </v-col>
                <v-col class="flex flex-row-reverse items-center">
                    <div
                        v-for="score in p2Scores"
                        :key="score.set"
                    >
                        {{ score.set }}<sup>{{ score.tie }}</sup>&nbsp;
                    </div>
                </v-col>
                <v-col
                    v-if="match.incomplete === 'R' || match.incomplete === 'WO' || match.incomplete === 'D' && match.winner_id === match.player1.id"
                    class="flex items-center"
                    cols="2"
                >
                    {{ match.winner_id === match.player1.id ? `${match.incomplete}.` : '' }}
                </v-col>
            </v-row>
            <v-row>
                <v-col class="text-right">
                    <v-chip
                        v-if="match.incomplete !== 'B'"
                        class="mx-1"
                        :to="{name: 'H2H', params: {p1Name: encodeName(match.player1.full_name), p1Id: match.player1.id, p2Name: encodeName(match.player2.full_name), p2Id: match.player2.id}}"
                        density="compact"
                    >
                        H2H
                    </v-chip>
                    <v-chip
                        v-if="match.incomplete !== 'B' && match.incomplete !== 'WO'"
                        :to="{name: 'MatchStats', params: {name: encodeName(name), id: id, editionNo: edition.edition_no, matchId: match.id, p1: encodeName(match.player1.full_name), p2: encodeName(match.player2.full_name)}}"
                        density="compact"
                    >
                        Match Stats
                    </v-chip>
                </v-col>
            </v-row>
        </v-container>
    </short-card>
</template>