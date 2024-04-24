<script setup>
import { formatCurrency, joinArray, headshot, flagSrc } from '@/components/utils';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps(['edition'])
const router = useRouter()

const seedsArray = props.edition.Entries.filter(entry => entry.seed)
const seeds = ref(seedsArray.toSorted((a, b) => {
    return a.seed - b.seed
}))
const ldaArray = props.edition.Entries.filter(entry => entry.lda)
const lda = ref(ldaArray[0])
const llsArray = props.edition.Entries.filter(entry => entry.status === 'LL')
const lls = ref(llsArray)
const altsArray = props.edition.Entries.filter(entry => entry.status === 'Alt')
const alts = ref(altsArray)
const wdsArray = props.edition.Entries.filter(entry => entry.wd)
const wds = ref(wdsArray)
const retsArray = props.edition.Entries.filter(entry => entry.ret)
const rets = ref(retsArray)
const wosArray = props.edition.Entries.filter(entry => entry.wo)
const wos = ref(wosArray)
const defsArray = props.edition.Entries.filter(entry => entry.defaulted)
const def = ref(defsArray)

const navigate = (id, name) => {
    router.push({name: 'PlayerOverview', params: { id: id, name: name}})
}
</script>

<template>
    <v-container>
        <v-row>
            <v-col cols="6">
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
                    <span>{{ edition.environment }} {{ edition.surface }}<span v-if="edition.hard_type"> ({{ edition.hard_type }})</span></span>
                </div>
            </v-col>
            <v-col cols="6">
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
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="6">
                <table v-if="seeds.length > 0" class="w-100">
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
                            <td>
                                <v-avatar>
                                    <v-img v-if="seed.Player.headshot" :src="headshot(seed.PlayerId)" @click="navigate(seed.PlayerId, seed.Player.full_name)"></v-img>
                                </v-avatar>
                            </td>
                            <td>
                                <v-img class="mini-flag" :src="flagSrc(seed.Player.country)"></v-img>
                            </td>
                            <td :class="{'strikethrough': seed.wd}"><RouterLink class="hover-link" :to="{name: 'PlayerOverview', params: {id: seed.PlayerId, name: seed.Player.full_name}}">{{ seed.Player.full_name }}</RouterLink></td>
                            <td :class="{'strikethrough': seed.wd}">{{ seed.rank }}</td>
                        </tr>
                    </tbody>
                </table>
            </v-col>
            <v-col cols="6">
                <table v-if="edition.winner_pm" class="w-100">
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
                <table v-if="lda.length > 0 || lls.length > 0 || alts.length > 0 || wds.length > 0 || rets.length > 0 || wos.length > 0 || def.length > 0" class="w-100 mt-2">
                    <thead v-if="lda.length > 0">
                        <tr>
                            <th colspan="4">Last direct acceptance</th>
                        </tr>
                    </thead>
                    <tbody v-if="lda.length > 0">
                        <tr>
                            <td>
                                <v-avatar>
                                    <v-img v-if="lda.Player.headshot" :src="headshot(lda.PlayerId)" @click="navigate(lda.PlayerId, lda.Player.full_name)"></v-img>
                                </v-avatar>
                            </td>
                            <td>
                                <v-img class="mini-flag" :src="flagSrc(lda.Player.country)"></v-img>
                            </td>
                            <td><RouterLink class="hover-link" :to="{name: 'PlayerOverview', params: {id: lda.PlayerId, name: lda.Player.full_name}}">{{ lda.Player.full_name }}</RouterLink></td>
                            <td><span v-if="lda.status === 'PR'">P</span>{{ lda.rank }}</td>
                        </tr>
                    </tbody>
                    <thead v-if="lls.length > 0">
                        <tr>
                            <th colspan="4">Lucky losers</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="player in lls">
                            <td>
                                <v-avatar>
                                    <v-img v-if="player.Player.headshot" :src="headshot(player.PlayerId)" @click="navigate(player.PlayerId, player.Player.full_name)"></v-img>
                                </v-avatar>
                            </td>
                            <td>
                                <v-img :src="flagSrc(player.Player.country)" class="mini-flag"></v-img>
                            </td>
                            <td><RouterLink class="hover-link" :to="{name: 'PlayerOverview', params: {id: player.PlayerId, name: player.Player.full_name}}">{{ player.Player.full_name }}</RouterLink></td>
                        </tr>
                    </tbody>
                    <thead v-if="alts.length > 0">
                        <tr>
                            <th colspan="4">Alternates</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="player in alts">
                            <td>
                                <v-avatar>
                                    <v-img v-if="player.Player.headshot" :src="headshot(player.PlayerId)" @click="navigate(player.PlayerId, player.Player.full_name)"></v-img>
                                </v-avatar>
                            </td>
                            <td>
                                <v-img :src="flagSrc(player.Player.country)" class="mini-flag"></v-img>
                            </td>
                            <td><RouterLink class="hover-link" :to="{name: 'PlayerOverview', params: {id: player.PlayerId, name: player.Player.full_name}}">{{ player.Player.full_name }}</RouterLink></td>
                        </tr>
                    </tbody>
                    <thead v-if="wds.length > 0">
                        <tr>
                            <th colspan="4">Withdrawals</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="player in wds">
                            <td>
                                <v-avatar>
                                    <v-img v-if="player.Player.headshot" :src="headshot(player.PlayerId)" @click="navigate(player.PlayerId, player.Player.full_name)"></v-img>
                                </v-avatar>
                            </td>
                            <td>
                                <v-img :src="flagSrc(player.Player.country)" class="mini-flag"></v-img>
                            </td>
                            <td><RouterLink class="hover-link" :to="{name: 'PlayerOverview', params: {id: player.PlayerId, name: player.Player.full_name}}">{{ player.Player.full_name }}</RouterLink></td>
                            <td v-if="player.wd === 'true'"></td>
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
                            <td>
                                <v-avatar>
                                    <v-img v-if="player.Player.headshot" :src="headshot(player.PlayerId)" @click="navigate(player.PlayerId, player.Player.full_name)"></v-img>
                                </v-avatar>
                            </td>
                            <td>
                                <v-img :src="flagSrc(player.Player.country)" class="mini-flag"></v-img>
                            </td>
                            <td><RouterLink class="hover-link" :to="{name: 'PlayerOverview', params: {id: player.PlayerId, name: player.Player.full_name}}">{{ player.Player.full_name }}</RouterLink></td>
                            <td v-if="player.ret === 'true'"></td>
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
                            <td>
                                <v-avatar>
                                    <v-img v-if="player.Player.headshot" :src="headshot(player.PlayerId)" @click="navigate(player.PlayerId, player.Player.full_name)"></v-img>
                                </v-avatar>
                            </td>
                            <td>
                                <v-img :src="flagSrc(player.Player.country)" class="mini-flag"></v-img>
                            </td>
                            <td><RouterLink class="hover-link" :to="{name: 'PlayerOverview', params: {id: player.PlayerId, name: player.Player.full_name}}">{{ player.Player.full_name }}</RouterLink></td>
                            <td v-if="player.wo === 'true'"></td>
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
                            <td>
                                <v-avatar>
                                    <v-img v-if="player.Player.headshot" :src="headshot(player.PlayerId)" @click="navigate(player.PlayerId, player.Player.full_name)"></v-img>
                                </v-avatar>
                            </td>
                            <td>
                                <v-img :src="flagSrc(player.Player.country)" class="mini-flag"></v-img>
                            </td>
                            <td><RouterLink class="hover-link" :to="{name: 'PlayerOverview', params: {id: player.PlayerId, name: player.Player.full_name}}">{{ player.Player.full_name }}</RouterLink></td>
                            <td v-if="player.defaulted === 'true'"></td>
                            <td v-else>{{ player.defaulted }}</td>
                        </tr>
                    </tbody>
                </table>
            </v-col>
        </v-row>
    </v-container>
</template>