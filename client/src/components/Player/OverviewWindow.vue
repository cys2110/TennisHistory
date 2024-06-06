<script setup lang="ts">
import { formatDate, plays, bh } from '../utils';
import type { PlayerDetails } from '../interfaces';
import { DateTime } from 'luxon'

const props = defineProps<{
    player: PlayerDetails
}>()
</script>

<template>
    <v-container>
        <v-row>
            <v-col class="sm:flex justify-between">
                <div class="w-100 mx-1">
                    <div class="my-2 bg-indigo-800 text-zinc-300 py-1 px-3 rounded-lg flex justify-between text-sm">
                        <span>Active</span>
                        <span>{{ player.turned_pro }} - {{ player.retired ?? 'present' }}</span>
                    </div>
                    <div v-if="player.dob" class="my-2 bg-indigo-800 text-zinc-300 py-1 px-3 rounded-lg flex justify-between text-sm">
                        <div class="flex items-center">Age</div>
                        <div class="!flex-col text-right">
                            <div>{{ Math.floor(Math.abs(DateTime.fromISO(player.dob).diffNow('years').toObject().years)) }}</div>
                            <div>({{ DateTime.fromISO(player.dob).setLocale('gb').toLocaleString(DateTime.DATE_FULL) }})</div>
                        </div>
                    </div>
                    <div v-if="player.height_cm && player.height_ft" class="my-2 bg-indigo-800 text-zinc-300 py-1 px-3 rounded-lg flex justify-between text-sm">
                        <span>Height</span>
                        <span>{{ player.height_cm }}cm ({{ player.height_ft }})</span>
                    </div>
                </div>
                <div class="w-100 mx-1">
                    <div v-if="player.rh !== null" class="my-2 bg-indigo-800 text-zinc-300 py-1 px-3 rounded-lg flex justify-between text-sm">
                        <span>Plays</span>
                        <span>{{ plays(player.rh) }}</span>
                    </div>
                    <div v-if="player.bh1 !== null" class="my-2 bg-indigo-800 text-zinc-300 py-1 px-3 rounded-lg flex justify-between text-sm">
                        <span>Backhand</span>
                        <span>{{ bh(player.bh1) }}</span>
                    </div>
                    <div v-if="player.coaches" class="my-2 bg-indigo-800 text-zinc-300 py-1 px-3 rounded-lg flex justify-between text-sm">
                        <div class="flex items-center">{{ player.coaches.length === 1 ? 'Coach' : 'Coaches' }}</div>
                        <div>
                            <div v-for="coach in player.coaches" :key="coach" class="text-right">{{ coach }}</div>
                        </div>
                    </div>
                </div>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-table v-if="player.ao_round || player.rg_round || player.wimbledon_round || player.uso_round || player.finals_round || player.davis_round || player.hopman_round || player.olympics_round || player.wct_round || player.gs_cup_round" class="bg-transparent rounded-lg">
                    <thead>
                        <tr class="bg-indigo-800 text-zinc-300">
                            <th class="text-center !font-bold">Tournament</th>
                            <th class="text-center !font-bold">Best Result</th>
                            <th class="!font-bold">Year(s) achieved</th>
                        </tr>
                    </thead>
                    <tbody class="text-zinc-300">
                        <tr v-if="player.ao_years">
                            <td class="text-center">
                                <router-link
                                    class="hover-link"
                                    :to="{name: 'Tournament', params: {name: 'Australian_Open', id: 580}}"
                                >
                                    Australian Open
                                </router-link>
                            </td>
                            <td class="text-center">{{ player.ao_round }}</td>
                            <td>{{ player.ao_years.join(', ') }}</td>
                        </tr>
                        <tr v-if="player.rg_years">
                            <td class="text-center">
                                <router-link
                                    class="hover-link"
                                    :to="{name: 'Tournament', params: {name: 'Roland_Garros', id: 520}}"
                                >
                                    Roland Garros
                                </router-link>
                            </td>
                            <td class="text-center">{{ player.rg_round }}</td>
                            <td>{{ player.rg_years.join(', ') }}</td>
                        </tr>
                        <tr v-if="player.wimbledon_years">
                            <td class="text-center">
                                <router-link
                                    class="hover-link"
                                    :to="{name: 'Tournament', params: {name: 'Wimbledon', id: 540}}"
                                >
                                    Wimbledon
                                </router-link>
                            </td>
                            <td class="text-center">{{ player.wimbledon_round }}</td>
                            <td>{{ player.wimbledon_years.join(', ') }}</td>
                        </tr>
                        <tr v-if="player.uso_years">
                            <td class="text-center">
                                <router-link
                                    class="hover-link"
                                    :to="{name: 'Tournament', params: {name: 'US_Open', id: 560}}"
                                >
                                    US Open
                                </router-link>
                            </td>
                            <td class="text-center">{{ player.uso_round }}</td>
                            <td>{{ player.uso_years.join(', ') }}</td>
                        </tr>
                        <tr v-if="player.finals_years">
                            <td class="text-center">
                                <router-link
                                    class="hover-link"
                                    :to="{name: 'Tournament', params: {name: 'ATP_Finals', id: 605}}"
                                >
                                    Year-End Finals
                                </router-link>
                            </td>
                            <td class="text-center">{{ player.finals_round }}</td>
                            <td>{{ player.finals_years.join(', ') }}</td>
                        </tr>
                        <tr v-if="player.olympics_years">
                            <td class="text-center">
                                <router-link
                                    class="hover-link"
                                    :to="{name: 'Tournament', params: {name: 'Olympics', id: 96}}"
                                >
                                    Olympics
                                </router-link>
                            </td>
                            <td class="text-center">{{ player.olympics_round }}</td>
                            <td>{{ player.olympics_years.join(', ') }}</td>
                        </tr>
                        <tr v-if="player.davis_years">
                            <td class="text-center">Davis Cup</td>
                            <td class="text-center">{{ player.davis_round }}</td>
                            <td>{{ player.davis_years.join(', ') }}</td>
                        </tr>
                        <tr v-if="player.hopman_years">
                            <td class="text-center">Hopman Cup</td>
                            <td class="text-center">{{ player.hopman_round }}</td>
                            <td>{{ player.hopman_years.join(', ') }}</td>
                        </tr>
                        <tr v-if="player.gs_cup_years">
                            <td class="text-center">Grand Slam Cup</td>
                            <td class="text-center">{{ player.gs_cup_round }}</td>
                            <td>{{ player.gs_cup_years.join(', ') }}</td>
                        </tr>
                        <tr v-if="player.wct_years">
                            <td class="text-center">WCT Finals</td>
                            <td class="text-center">{{ player.wct_round }}</td>
                            <td>{{ player.wct_years.join(', ') }}</td>
                        </tr>
                    </tbody>
                </v-table>
            </v-col>
        </v-row>
    </v-container>
</template>