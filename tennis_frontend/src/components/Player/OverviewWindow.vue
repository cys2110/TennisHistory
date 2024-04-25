<script setup>
import { computed } from 'vue';
import { formatDate, joinArray } from '@/components/utils';

const props = defineProps(['player'])

const yearsActive = computed(() => {
    if (props.player.turned_pro && props.player.retired) {
        return `${props.player.turned_pro} - ${props.player.retired}`
    } else {
        return `${props.player.turned_pro} - present`
    }
})

const height = computed(() => {
    return `${props.player.height_cm}cm (${props.player.height_ft})`
})

const rh = computed(() => {
    if (props.player.rh) { return 'Right-handed' }
    else { return 'Left-handed' }
})

const bh = computed(() => {
    if (props.player.bh1) { return 'One-handed' }
    else { return 'Two-handed' }
})
</script>

<template>
    <v-container>
        <v-row>
            <v-col cols="6">
                <div class="detail">
                    <span>Years active</span>
                    <span>{{ yearsActive }}</span>
                </div>
                <div class="detail" v-if="player.dob">
                    <span>Date of birth</span>
                    <span>{{ formatDate(player.dob) }}</span>
                </div>
                <div class="detail" v-if="player.height_cm">
                    <span>Height</span>
                    <span>{{ height }}</span>
                </div>
            </v-col>
            <v-col cols="6">
                <div class="detail" v-if="player.rh || player.rh === false">
                    <span>Plays</span>
                    <span>{{ rh }}</span>
                </div>
                <div class="detail" v-if="player.bh1 || player.bh1 === false">
                    <span>Backhand</span>
                    <span>{{ bh }}</span>
                </div>
                <div class="detail" v-if="player.coaches.length > 0">
                    <span v-if="player.coaches.length === 1">Coach</span>
                    <span v-else>Coaches</span>
                    <span>{{ joinArray(player.coaches) }}</span>
                </div>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-table v-if="player.ao_round || player.rg_round || player.wimbledon_round || player.uso_round || player.finals_round || player.davis_round || player.hopman_round || player.olympics_round || player.wct_round || player.gs_cup_round" class="w-75 mx-auto rounded-xl">
                    <thead>
                        <tr class="bg-indigo-accent-1">
                            <th class="font-weight-bold text-center">Tournament</th>
                            <th class="font-weight-bold text-center">Best Result</th>
                            <th class="font-weight-bold">Year(s) achieved</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="player.ao_round">
                            <td class="text-center">Australian Open</td>
                            <td class="text-center">{{ player.ao_round }}</td>
                            <td>{{ joinArray(player.ao_years) }}</td>
                        </tr>
                        <tr v-if="player.rg_round">
                            <td class="text-center">Roland Garros</td>
                            <td class="text-center">{{ player.rg_round }}</td>
                            <td>{{ joinArray(player.rg_years) }}</td>
                        </tr>
                        <tr v-if="player.wimbledon_round">
                            <td class="text-center">Wimbledon</td>
                            <td class="text-center">{{ player.wimbledon_round }}</td>
                            <td>{{ joinArray(player.wimbledon_years) }}</td>
                        </tr>
                        <tr v-if="player.uso_round">
                            <td class="text-center">US Open</td>
                            <td class="text-center">{{ player.uso_round }}</td>
                            <td>{{ joinArray(player.uso_years) }}</td>
                        </tr>
                        <tr v-if="player.finals_round">
                            <td class="text-center">Year-end Finals</td>
                            <td class="text-center">{{ player.finals_round }}</td>
                            <td>{{ joinArray(player.finals_years) }}</td>
                        </tr>
                        <tr v-if="player.olympics_round">
                            <td class="text-center">Olympics</td>
                            <td class="text-center">{{ player.olympics_round }}</td>
                            <td>{{ joinArray(player.olympics_years) }}</td>
                        </tr>
                        <tr v-if="player.davis_round">
                            <td class="text-center">Davis Cup</td>
                            <td class="text-center">{{ player.davis_round }}</td>
                            <td>{{ joinArray(player.davis_years) }}</td>
                        </tr>
                        <tr v-if="player.hopman_round">
                            <td class="text-center">Hopman</td>
                            <td class="text-center">{{ player.hopman_round }}</td>
                            <td>{{ joinArray(player.hopman_years) }}</td>
                        </tr>
                        <tr v-if="player.gs_cup_round">
                            <td class="text-center">Grand Slam Cup</td>
                            <td class="text-center">{{ player.gs_cup_round }}</td>
                            <td>{{ joinArray(player.gs_cup_years) }}</td>
                        </tr>
                        <tr v-if="player.wct_round">
                            <td class="text-center">WCT Finals</td>
                            <td class="text-center">{{ player.wct_round }}</td>
                            <td>{{ joinArray(player.wct_years) }}</td>
                        </tr>
                    </tbody>
                </v-table>
            </v-col>
        </v-row>
    </v-container>
</template>