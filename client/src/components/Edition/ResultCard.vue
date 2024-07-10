<script setup lang="ts">
import { useDisplay } from 'vuetify';
import * as functions from '../utils';
import type { MatchResult, Status } from '../interfaces';

const props = defineProps<{
    match: MatchResult
    seeds: string[]
    statuses: Status
}>()

const { xl } = useDisplay()

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
    <short-card class="my-5 mx-2 text-zinc-300 text-xs sm:w-1/2 lg:w-2/5">
        <v-container>
            <v-row>
                <v-col>
                    <span v-if="match.date">{{ functions.formatDate(match.date) }}</span>
                    <span v-if="match.date && match.court"> — </span>
                    <span v-if="match.court">{{ match.court }}</span>
                </v-col>
                <v-col
                    v-if="match.duration"
                    class="text-right"
                    cols="3"
                >
                    {{ functions.formatTime(match.duration) }}
                </v-col>
            </v-row>
            <v-row dense class="py-2">
                <v-col
                    class="flex items-center"
                    :cols="match.loser_score?.incomplete ? 5 : 8"
                >
                    <div class="mx-0.5">
                        <flag-img
                            class="w-[1rem] lg:w-[2rem]"
                            :src="functions.flagSrc(match.winner.country.id)"
                            :alt="match.winner.country.name"
                        />
                    </div>
                    <div class="mx-0.5">
                        <v-avatar :size="xl ? 'small' : 'x-small'">
                            <v-img
                                :src="functions.headshot(match.winner.id)"
                                :alt="match.winner.full_name"
                            />
                        </v-avatar>
                    </div>
                    <div class="mx-0.5">
                        <router-link
                            class="hover-link"
                            :to="{name: 'Player', params: {name: functions.encodeName(match.winner.full_name), id: match.winner.id}}"
                        >
                            {{ match.winner.full_name }}
                        </router-link>
                        
                        <small
                           v-if="seeds.includes(match.winner.id) || Object.values(statuses).some(array => array.includes(match.winner.id))"
                            class="text-[8px] xl:text-[10px]"
                        >
                             ({{ seeds.indexOf(match.winner.id) + 1 || '' }}{{ findStatus(match.winner.id) }})
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
                    <div class="flex">
                        <div>{{ match.winner_score?.s1 }}<sup>{{ match.winner_score?.t1 }}</sup></div>
                        &nbsp;<div>{{ match.winner_score?.s2 }}<sup>{{ match.winner_score?.t2 }}</sup></div>
                        &nbsp;<div>{{ match.winner_score?.s3 }}<sup>{{ match.winner_score?.t3 }}</sup></div>
                        &nbsp;<div>{{ match.winner_score?.s4 }}<sup>{{ match.winner_score?.t4 }}</sup></div>
                        &nbsp;<div>{{ match.winner_score?.s5 }}<sup>{{ match.winner_score?.t5 }}</sup></div>
                    </div>
                </v-col>
                <v-col 
                    v-if="match.loser_score?.incomplete"
                    cols="2"
                />
            </v-row>
            <v-row dense>
                <v-col
                    v-if="match.loser"
                    class="flex items-center"
                    :cols="match.loser_score?.incomplete ? 5 : 8"
                >
                    <div class="mx-0.5">
                        <flag-img
                            class="w-[1rem] lg:w-[2rem]"
                            :src="functions.flagSrc(match.loser.country.id)"
                            :alt="match.loser.country.name"
                        />
                    </div>
                    <div class="mx-0.5">
                        <v-avatar :size="xl ? 'small' : 'x-small'">
                            <v-img
                                :src="functions.headshot(match.loser.id)"
                                :alt="match.loser.full_name"
                            />
                        </v-avatar>
                    </div>
                    <div class="mx-0.5">
                        <router-link
                            class="hover-link"
                            :to="{name: 'Player', params: {name: functions.encodeName(match.loser.full_name), id: match.loser.id}}"
                        >
                            {{ match.loser.full_name }}
                        </router-link>
                        <small
                           v-if="seeds.includes(match.loser.id) || Object.values(statuses).some(array => array.includes(match.loser?.id))"
                            class="text-[8px] xl:text-[10px]"
                        >
                             ({{ seeds.indexOf(match.loser.id) + 1 || '' }}{{ findStatus(match.loser.id) }})
                        </small>
                    </div>
                </v-col>
                <v-col v-else>BYE</v-col>
                <v-col cols="1"></v-col>
                <v-col
                    class="flex flex-row-reverse items-center"
                    cols="3"
                >
                    <div class="flex">
                        <div>{{ match.loser_score?.s1 }}<sup>{{ match.loser_score?.t1 }}</sup></div>
                        &nbsp;<div>{{ match.loser_score?.s2 }}<sup>{{ match.loser_score?.t2 }}</sup></div>
                        &nbsp;<div>{{ match.loser_score?.s3 }}<sup>{{ match.loser_score?.t3 }}</sup></div>
                        &nbsp;<div>{{ match.loser_score?.s4 }}<sup>{{ match.loser_score?.t4 }}</sup></div>
                        &nbsp;<div>{{ match.loser_score?.s5 }}<sup>{{ match.loser_score?.t5 }}</sup></div>
                    </div>
                </v-col>
                <v-col
                    v-if="match.loser_score?.incomplete"
                    class="flex items-center justify-center"
                    cols="2"
                >
                    {{ match.loser_score.incomplete }}.
                </v-col>
            </v-row>
            <v-row v-if="match.loser">
                <v-col>{{ match.umpire ?? '' }}</v-col>
                <v-col class="flex justify-end">
                    <v-chip
                        v-if="!match.incomplete"
                        class="mx-1"
                        :to="{name: 'H2H', params: {p1Name: functions.encodeName(match.winner.full_name), p1Id: match.winner.id, p2Name: functions.encodeName(match.loser.full_name), p2Id: match.loser.id}}"
                        :size="xl ? 'small' : 'x-small'"
                    >
                        H2H
                    </v-chip>
                    <v-chip
                        v-if="!match.incomplete && match.loser_score?.incomplete !== 'WO'"
                        class="mx-1"
                        :to="{name: 'MatchStats', params: {matchId: match.match_no}}"
                        :size="xl ? 'small' : 'x-small'"
                    >
                        Stats
                    </v-chip>
                </v-col>
            </v-row>
        </v-container>
    </short-card>
</template>