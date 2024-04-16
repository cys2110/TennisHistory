<script setup>
import { environment, surface, formatCurrency, joinArray, headshot, flagSrc } from '@/components/utils';
import EntryService from '@/services/EntryService';
import { onMounted, ref } from 'vue';

const props = defineProps(['edition'])
const seeds = ref([])
const rets = ref([])
const wds = ref([])
const lls = ref([])
const alts = ref([])
const wos = ref([])
const lda = ref([])
const def = ref([])

onMounted(() => {
    EntryService.getEntriesByEdition(props.edition.id)
    .then(response => {
        const seedsArray = response.data.filter(entry => entry.seed)
        seeds.value = seedsArray.toSorted((a, b) => {
            return a.seed - b.seed
        })
        const ldaArray = response.data.filter(entry => entry.lda)
        lda.value = ldaArray
        const llsArray = response.data.filter(entry => entry.status === 'LL')
        lls.value = llsArray
        const altsArray = response.data.filter(entry => entry.status === 'Alt')
        alts.value = altsArray
        const retsArray = response.data.filter(entry => entry.ret)
        rets.value = retsArray
        const wdsArray = response.data.filter(entry => entry.wd)
        wds.value = wdsArray
        const wosArray = response.data.filter(entry => entry.wo)
        wos.value = wosArray
        const defsArray = response.data.filter(entry => entry.defaulted)
        def.value = defsArray
    })
    .catch(error => console.log(error))
})
</script>

<template>
    <main>
        <div class="details-container">
            <div class="details-column">
                <div class="detail" v-if="edition.venue">
                    <span>Venue</span>
                    <span>{{ edition.venue }}</span>
                </div>
                <div class="detail">
                    <span>City</span>
                    <span>{{ edition.city }}</span>
                </div>
                <div class="detail" v-if="edition.surface">
                    <span>Surface</span>
                    <span>{{ environment(edition.environment) }} {{ surface(edition.surface) }}<span v-if="edition.hard_type"> ({{ edition.hard_type }})</span></span>
                </div>
            </div>
            <div class="details-column">
                <div class="detail" v-if="edition.pm">
                    <span>Prize money</span>
                    <span>{{ formatCurrency(edition.currency, edition.pm) }}</span>
                </div>
                <div class="detail" v-if="edition.tfc">
                    <span>Total financial commitment</span>
                    <span>{{ formatCurrency(edition.currency, edition.tfc) }}</span>
                </div>
                <div class="detail" v-if="edition.supervisors.length > 0">
                    <span v-if="edition.supervisors.length === 1">Supervisor</span>
                    <span v-else>Supervisors</span>
                    <span>{{ joinArray(edition.supervisors) }}</span>
                </div>
            </div>
        </div>
        <div class="cards-container">
            <div class="card-container">
                <div class="edition-card" v-if="seeds.length > 0">
                    <table>
                        <thead>
                            <tr>
                                <th>Seed</th>
                                <th colspan="3">Player</th>
                                <th>Rank</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="seed in seeds" :key="seed.id">
                                <td class="centred">{{ seed.seed }}</td>
                                <td><img class="headshot" v-if="seed.player_headshot=== 'True' " :src="headshot(seed.player_id)" /></td>
                                <td><img class="mini-flag" :src="flagSrc(seed.player_country)" /></td>
                                <td :class="{'strikethrough': seed.wd}">{{ seed.player_name }}</td>
                                <td :class="{'strikethrough': seed.wd}">{{ seed.rank }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="card-container">
                <div class="edition-card" v-if="edition.winner_pm">
                    <table>
                        <thead>
                            <tr>
                                <th></th>
                                <th>Prize money</th>
                                <th>Points</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>WINNER</td>
                                <td class="centred">{{ formatCurrency(edition.currency, edition.winner_pm) }}</td>
                                <td class="centred">{{ edition.winner_pts }}</td>
                            </tr>
                            <tr>
                                <td>FINALIST</td>
                                <td class="centred">{{ formatCurrency(edition.currency, edition.finalist_pm) }}</td>
                                <td class="centred">{{ edition.finalist_pts }}</td>
                            </tr>
                            <tr>
                                <td>SEMIFINALIST</td>
                                <td class="centred">{{ formatCurrency(edition.currency, edition.semifinalist_pm) }}</td>
                                <td class="centred">{{ edition.semifinalist_pts }}</td>
                            </tr>
                            <tr>
                                <td>QUARTERFINALIST</td>
                                <td class="centred">{{ formatCurrency(edition.currency, edition.quarterfinalist_pm) }}</td>
                                <td class="centred">{{ edition.quarterfinalist_pts }}</td>
                            </tr>
                            <tr v-if="edition.r128_pm">
                                <td>4TH ROUND</td>
                                <td class="centred">{{ formatCurrency(edition.currency, edition.r16_pm) }}</td>
                                <td class="centred">{{ edition.r16_pts }}</td>
                            </tr>
                            <tr v-if="edition.r64_pm">
                                <td>3RD ROUND</td>
                                <td class="centred" v-if="edition.r128_pm">{{ formatCurrency(edition.currency, edition.r32_pm) }}</td>
                                <td class="centred" v-else>{{ formatCurrency(edition.currency, edition.r16_pm) }}</td>
                                <td class="centred" v-if="edition.r128_pm">{{ edition.r32_pts }}</td>
                                <td class="centred" v-else>{{ edition.r16_pts }}</td>
                            </tr>
                            <tr>
                                <td>2ND ROUND</td>
                                <td class="centred" v-if="edition.r128_pm">{{ formatCurrency(edition.currency, edition.r64_pm) }}</td>
                                <td class="centred" v-else-if="edition.r64_pm">{{ formatCurrency(edition.currency, edition.r32_pm) }}</td>
                                <td class="centred" v-else>{{ formatCurrency(edition.currency, edition.r16_pm) }}</td>
                                <td class="centred" v-if="edition.r128_pm">{{ edition.r64_pts }}</td>
                                <td class="centred" v-else-if="edition.r64_pm">{{ edition.r32_pts }}</td>
                                <td class="centred" v-else>{{ edition.r16_pts }}</td>
                            </tr>
                            <tr>
                                <td>1ST ROUND</td>
                                <td class="centred" v-if="edition.r128_pm">{{ formatCurrency(edition.currency, edition.r128_pm) }}</td>
                                <td class="centred" v-else-if="edition.r64_pm">{{ formatCurrency(edition.currency, edition.r64_pm) }}</td>
                                <td class="centred" v-else>{{ formatCurrency(edition.currency, edition.r32_pm) }}</td>
                                <td class="centred" v-if="edition.r128_pm">{{ edition.r128_pts }}</td>
                                <td class="centred" v-else-if="edition.r64_pm">{{ edition.r64_pts }}</td>
                                <td class="centred" v-else>{{ edition.r32_pts }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="edition-card">
                    <table>
                        <thead v-if="lda.length > 0">
                            <tr>
                                <th colspan="4">Last direct acceptance</th>
                            </tr>
                        </thead>
                        <tbody v-if="lda.length > 0">
                            <tr>
                                <td><img v-if="lda[0].player_headshot === 'True'" :src="headshot(lda[0].player_id)" /></td>
                                <td><img :src="flagSrc(lda[0].player_country)" /></td>
                                <td>{{ lda[0].player_name }}</td>
                                <td><span v-if="lda[0].status === 'PR'">P</span>{{ lda[0].rank }}</td>
                            </tr>
                        </tbody>
                        <thead v-if="lls.length > 0">
                            <tr>
                                <th colspan="4">Lucky losers</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="player in lls">
                                <td><img v-if="player.player_headshot === 'True'" :src="headshot(player.player_id)" class="headshot" /></td>
                                <td><img :src="flagSrc(player.player_country)" class="mini-flag" /></td>
                                <td>{{ player.player_name }}</td>
                            </tr>
                        </tbody>
                        <thead v-if="alts.length > 0">
                            <tr>
                                <th colspan="4">Alternates</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="player in alts">
                                <td><img v-if="player.player_headshot === 'True'" :src="headshot(player.player_id)" class="headshot" /></td>
                                <td><img :src="flagSrc(player.player_country)" class="mini-flag" /></td>
                                <td>{{ player.player_name }}</td>
                            </tr>
                        </tbody>
                        <thead v-if="wds.length > 0">
                            <tr>
                                <th colspan="4">Withdrawals</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="player in wds">
                                <td><img v-if="player.player_headshot === 'True'" :src="headshot(player.player_id)" class="headshot" /></td>
                                <td><img :src="flagSrc(player.player_country)" class="mini-flag" /></td>
                                <td>{{ player.player_name }}</td>
                                <td v-if="player.wd === 'True'"></td>
                                <td v-else>{{ player.wd }}</td>
                            </tr>
                        </tbody>
                        <thead v-if="rets.length > 0">
                            <tr>
                                <th colspan="4">Retirements</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="player in rets">
                                <td><img v-if="player.player_headshot === 'True'" :src="headshot(player.player_id)" class="headshot" /></td>
                                <td><img :src="flagSrc(player.player_country)" class="mini-flag" /></td>
                                <td>{{ player.player_name }}</td>
                                <td v-if="player.ret === 'True'"></td>
                                <td v-else>{{ player.ret }}</td>
                            </tr>
                        </tbody>
                        <thead v-if="wos.length > 0">
                            <tr>
                                <th colspan="4">Walkovers</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="player in wos">
                                <td><img v-if="player.player_headshot === 'True'" :src="headshot(player.player_id)" class="headshot" /></td>
                                <td><img :src="flagSrc(player.player_country)" class="mini-flag" /></td>
                                <td>{{ player.player_name }}</td>
                                <td v-if="player.wo === 'True'"></td>
                                <td v-else>{{ player.wo }}</td>
                            </tr>
                        </tbody>
                        <thead v-if="def.length > 0">
                            <tr>
                                <th colspan="4">Defaults</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="player in def">
                                <td><img v-if="player.player_headshot === 'True'" :src="headshot(player.player_id)" class="headshot" /></td>
                                <td><img :src="flagSrc(player.player_country)" class="mini-flag" /></td>
                                <td>{{ player.player_name }}</td>
                                <td v-if="player.defaulted === 'True'"></td>
                                <td v-else>{{ player.defaulted }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </main>
</template>