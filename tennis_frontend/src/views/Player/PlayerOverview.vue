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
    <main>
        <div class="details-container">
            <div class="details-column">
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
            </div>
            <div class="details-column">
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
            </div>
        </div>
        <div class="major-table">
            <table>
                <thead>
                    <tr>
                        <th>Tournament</th>
                        <th>Best Result</th>
                        <th>Year(s) achieved</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="player.ao_round">
                        <td>Australian Open</td>
                        <td class="centred">{{ player.ao_round }}</td>
                        <td>{{ joinArray(player.ao_years) }}</td>
                    </tr>
                    <tr v-if="player.rg_round">
                        <td>Roland Garros</td>
                        <td class="centred">{{ player.rg_round }}</td>
                        <td>{{ joinArray(player.rg_years) }}</td>
                    </tr>
                    <tr v-if="player.wimbledon_round">
                        <td>Wimbledon</td>
                        <td class="centred">{{ player.wimbledon_round }}</td>
                        <td>{{ joinArray(player.wimbledon_years) }}</td>
                    </tr>
                    <tr v-if="player.uso_round">
                        <td>US Open</td>
                        <td class="centred">{{ player.uso_round }}</td>
                        <td>{{ joinArray(player.uso_years) }}</td>
                    </tr>
                    <tr v-if="player.finals_round">
                        <td>Year-end Finals</td>
                        <td class="centred">{{ player.finals_round }}</td>
                        <td>{{ joinArray(player.finals_years) }}</td>
                    </tr>
                    <tr v-if="player.olympics_round">
                        <td>Olympics</td>
                        <td class="centred">{{ player.olympics_round }}</td>
                        <td>{{ joinArray(player.olympics_years) }}</td>
                    </tr>
                    <tr v-if="player.davis_round">
                        <td>Davis Cup</td>
                        <td class="centred">{{ player.davis_round }}</td>
                        <td>{{ joinArray(player.davis_years) }}</td>
                    </tr>
                    <tr v-if="player.hopman_round">
                        <td>Hopman</td>
                        <td class="centred">{{ player.hopman_round }}</td>
                        <td>{{ joinArray(player.hopman_years) }}</td>
                    </tr>
                    <tr v-if="player.gs_cup_round">
                        <td>Grand Slam Cup</td>
                        <td class="centred">{{ player.gs_cup_round }}</td>
                        <td>{{ joinArray(player.gs_cup_years) }}</td>
                    </tr>
                    <tr v-if="player.wct_round">
                        <td>WCT Finals</td>
                        <td class="centred">{{ player.wct_round }}</td>
                        <td>{{ joinArray(player.wct_years) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </main>
</template>

<style scoped>
main {
    display: flex;
    flex-direction: column;
}

.major-table {
    align-self: center;
    margin-top: 3rem;
}
</style>