<script setup lang="ts">
import { headshot, flagSrc, encodeName, status } from '../utils';
import type { DrawResult, Status } from '../interfaces';

const props = defineProps<{
    match: DrawResult
    seeds: string[]
    statuses: Status
}>()

const findStatus = (value: string): keyof Status | string => {
    for (const key in props.statuses) {
        if (props.statuses[key as keyof Status].includes(value)) {
            return key as keyof Status
        }
    }
    return ''
}
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
                    :cols="match.p1_score?.incomplete || match.p2_score?.incomplete ? 6 : 8"
                >
                    <div
                        v-if="match.p1"
                        class="mx-0.5"
                    >
                        <flag-img
                            class="w-[2rem]"
                            :src="flagSrc(match.entry1.Player.country)"
                            :alt="match.entry1.Player.country"
                        />
                    </div>
                    <div
                        v-if="match.entry1"
                        class="mx-0.5"
                    >
                        <v-avatar size="small">
                            <v-img
                                :src="headshot(match.entry1.Player.id)"
                                :alt="match.entry1.Player.full_name"
                            />
                        </v-avatar>
                    </div>
                    <div
                        v-if="match.entry1"
                        class="mx-0.5"
                    >
                        <router-link
                            class="hover-link"
                            :to="{name: 'Player', params: {name: encodeName(match.entry1.Player.full_name), id: match.entry1.Player.id}}"
                        >
                            {{ match.entry1.Player.full_name }}
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
                        v-if="match.entry1 && match.winner_id === match.entry1.Player.id"
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
                    {{ match.winner_id === match.entry2.Player.id ? `${match.incomplete}.` : '' }}
                </v-col>
            </v-row>
            <v-row>
                <v-col
                    class="flex items-center"
                    :cols="match.incomplete === 'WO' || match.incomplete === 'R' || match.incomplete === 'D' ? 6 : 8"
                >
                    <div
                        v-if="match.entry2"
                        class="mx-1"
                    >
                        <flag-img
                            class="w-[1rem]"
                            :src="flagSrc(match.entry2.Player.country)"
                            :alt="match.entry2.Player.country"
                        />
                    </div>
                    <div
                        v-if="match.entry2"
                        class="mx-0.5"
                    >
                        <v-avatar size="small">
                            <v-img
                                :src="headshot(match.entry2.Player.id)"
                                :alt="match.entry2.Player.full_name"
                            />
                        </v-avatar>
                    </div>
                    <div
                        v-if="match.entry2"
                        class="mx-0.5"
                    >
                        <router-link
                            class="hover-link"
                            :to="{name: 'Player', params: {name: encodeName(match.entry2.Player.full_name), id: match.entry2.Player.id}}"
                        >
                            {{ match.entry2.Player.full_name }}
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
                        v-if="match.entry2 && match.winner_id === match.entry2.Player.id"
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
                    v-if="match.incomplete === 'R' || match.incomplete === 'WO' || match.incomplete === 'D' && match.winner_id === match.entry1.Player.id"
                    class="flex items-center"
                    cols="2"
                >
                    {{ match.winner_id === match.entry1.Player.id ? `${match.incomplete}.` : '' }}
                </v-col>
            </v-row>
            <v-row>
                <v-col class="text-right">
                    <v-chip
                        v-if="match.incomplete !== 'B'"
                        class="mx-1"
                        :to="{name: 'H2H', params: {p1Name: encodeName(match.entry1.Player.full_name), p1Id: match.entry1.Player.id, p2Name: encodeName(match.entry2.Player.full_name), p2Id: match.entry2.Player.id}}"
                        density="compact"
                    >
                        H2H
                    </v-chip>
                    <v-chip
                        v-if="match.incomplete !== 'B' && match.incomplete !== 'WO'"
                        :to="{name: 'MatchStats', params: {name: encodeName(name), id: id, editionNo: edition.edition_no, matchId: match.id, p1: encodeName(match.entry1.Player.full_name), p2: encodeName(match.entry2.Player.full_name)}}"
                        density="compact"
                    >
                        Stats
                    </v-chip>
                </v-col>
            </v-row>
        </v-container>
    </short-card>
</template>