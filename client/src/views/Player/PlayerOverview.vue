<script setup lang="ts">
import { DateTime } from 'luxon';
import convert from 'convert'
import { plays, bh, encodeName, convertToFt } from '@/components/utils';
import type { PlayerDetails } from '@/components/interfaces';

const props = defineProps<{
    player: PlayerDetails
}>()

// const results = [
//     {
//         tournament: 'Australian Open',
//         id: 580,
//         round: props.player.ao_round ?? '—',
//         years: props.player.ao_years?.join(', ') ?? '—'
//     },
//     {
//         tournament: 'Roland Garros',
//         id: 520,
//         round: props.player.rg_round ?? '—',
//         years: props.player.rg_years?.join(', ') ?? '—'
//     },
//     {
//         tournament: 'Wimbledon',
//         id: 540,
//         round: props.player.wimbledon_round ?? '—',
//         years: props.player.wimbledon_years?.join(', ') ?? '—'
//     },
//     {
//         tournament: 'US Open',
//         id: 560,
//         round: props.player.uso_round ?? '—',
//         years: props.player.uso_years?.join(', ') ?? '—'
//     },
//     {
//         tournament: 'Year-End Finals',
//         id: 605,
//         round: props.player.finals_round ?? '—',
//         years: props.player.finals_years?.join(', ') ?? '—'
//     },
//     {
//         tournament: 'Olympics',
//         id: 96,
//         round: props.player.olympics_round ?? '—',
//         years: props.player.olympics_years?.join(', ') ?? '—'
//     },
//     {
//         tournament: 'Davis Cup',
//         id: 10005,
//         round: props.player.davis_round ?? '—',
//         years: props.player.davis_years?.join(', ') ?? '—'
//     },
//     {
//         tournament: 'Hopman Cup',
//         id: 10004,
//         round: props.player.hopman_round ?? '—',
//         years: props.player.hopman_years?.join(', ') ?? '—'
//     },
//     {
//         tournament: 'Grand Slam Cup',
//         id: 604,
//         round: props.player.gs_cup_round ?? '—',
//         years: props.player.gs_cup_years?.join(', ') ?? '—'
//     },
//     {
//         tournament: 'WCT Finals',
//         id: 10003,
//         round: props.player.wct_round ?? '—',
//         years: props.player.wct_years?.join(', ') ?? '—'
//     }
// ]
</script>

<template>
    <v-container>
        <v-row>
            <v-col class="sm:flex justify-between">
                <div class="w-100 mx-1">
                    <div class="my-2 bg-indigo-800 text-zinc-300 py-1 px-3 rounded-lg flex justify-between text-sm">
                        <span>Active</span>
                        <span>{{ player.turned_pro.id }} - {{ player.retired ? player.retired.id : 'present' }}</span>
                    </div>
                    <div
                        v-if="player.dob"
                        class="my-2 bg-indigo-800 text-zinc-300 py-1 px-3 rounded-lg flex justify-between text-sm"
                    >
                        <div class="flex items-center">Age</div>
                        <div class="!flex-col text-right">
                            <div>{{ Math.floor(Math.abs(DateTime.fromISO(player.dob).diffNow('years').toObject().years)) }}</div>
                            <div>({{ DateTime.fromISO(player.dob).setLocale('gb').toLocaleString(DateTime.DATE_FULL) }})</div>
                        </div>
                    </div>
                    <div
                        v-if="player.height_cm"
                        class="my-2 bg-indigo-800 text-zinc-300 py-1 px-3 rounded-lg flex justify-between text-sm"
                    >
                        <span>Height</span>
                        <span>{{ player.height_cm }}cm ({{ convertToFt(player.height_cm) }})</span>
                    </div>
                </div>
                <div class="w-100 mx-1">
                    <div
                        v-if="player.rh !== null"
                        class="my-2 bg-indigo-800 text-zinc-300 py-1 px-3 rounded-lg flex justify-between text-sm"
                    >
                        <span>Plays</span>
                        <span>{{ plays(player.rh) }}</span>
                    </div>
                    <div
                        v-if="player.bh1 !== null"
                        class="my-2 bg-indigo-800 text-zinc-300 py-1 px-3 rounded-lg flex justify-between text-sm"
                    >
                        <span>Backhand</span>
                        <span>{{ bh(player.bh1) }}</span>
                    </div>
                    <!-- <div
                        v-if="player.coaches"
                        class="my-2 bg-indigo-800 text-zinc-300 py-1 px-3 rounded-lg flex justify-between text-sm"
                    >
                        <div class="flex items-center">{{ player.coaches.length === 1 ? 'Coach' : 'Coaches' }}</div>
                        <div>
                            <div
                                v-for="coach in player.coaches"
                                :key="coach.first_name"
                                class="text-right"
                            >
                                {{ coach.first_name }} {{ coach.last_name }}
                            </div>
                        </div>
                    </div> -->
                </div>
            </v-col>
        </v-row>
        <!-- <v-row>
            <v-col>
                <v-table class="bg-transparent rounded-lg">
                    <thead>
                        <tr class="bg-indigo-800 text-zinc-300">
                            <th class="text-center !font-bold">Tournament</th>
                            <th class="text-center !font-bold">Best Result</th>
                            <th class="!font-bold">Year(s) achieved</th>
                        </tr>
                    </thead>
                    <tbody class="text-zinc-300">
                        <tr v-for="result in results" :key="result.tournament">
                            <td class="text-center">
                                <router-link
                                    class="hover-link"
                                    :to="{name: 'Tournament', params: {name: encodeName(result.tournament), id: result.id}}"
                                >
                                    {{ result.tournament }}
                                </router-link>
                            </td>
                            <td class="text-center">{{ result.round }}</td>
                            <td>{{ result.years }}</td>
                        </tr>
                    </tbody>
                </v-table>
            </v-col>
        </v-row> -->
    </v-container>
</template>