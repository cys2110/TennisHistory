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
const lda = ref(ldaArray)
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
    router.push({name: 'Player', params: { id: id, name: name}})
}
</script>

<template>
    <v-container>
        <v-row>
            <v-col cols="6">
                <div class="detail" v-if="edition.venue">
                    <span class="font-weight-bold">Venue</span>
                    <span>{{ edition.venue }}</span>
                </div>
                <div class="detail">
                    <span class="font-weight-bold">City</span>
                    <span>{{ edition.city }}</span>
                </div>
                <div class="detail" v-if="edition.surface">
                    <span class="font-weight-bold">Surface</span>
                    <span>{{ edition.environment }} {{ edition.surface }}<span v-if="edition.hard_type"> ({{ edition.hard_type }})</span></span>
                </div>
            </v-col>
            <v-col cols="6">
                <div class="detail" v-if="edition.pm">
                    <span class="font-weight-bold">Prize money</span>
                    <span>{{ formatCurrency(edition.currency, edition.pm) }}</span>
                </div>
                <div class="detail" v-if="edition.tfc">
                    <span class="font-weight-bold">Total financial commitment</span>
                    <span>{{ formatCurrency(edition.currency, edition.tfc) }}</span>
                </div>
                <div class="detail" v-if="edition.supervisors.length > 0">
                    <span class="font-weight-bold">{{ edition.supervisors.length === 1 ? 'Supervisor' : 'Supervisors' }}</span>
                    <span>{{ joinArray(edition.supervisors) }}</span>
                </div>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="6">
                <v-table
                    v-if="seeds.length > 0"
                    height="30rem"
                    fixed-header
                    hover
                    style="width: 90%"
                    class="mx-auto rounded-lg"
                >
                    <thead>
                        <tr>
                            <th class="font-weight-bold text-center bg-indigo-accent-1">Seed</th>
                            <th class="font-weight-bold bg-indigo-accent-1">Player</th>
                            <th class="font-weight-bold text-center  bg-indigo-accent-1">Rank</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="seed in seeds" :key="seed.id">
                            <td class="text-center">{{ seed.seed }}</td>
                            <td class="d-flex align-center">
                                <v-avatar variant="outlined">
                                    <v-img v-if="seed.Player.headshot" :src="headshot(seed.PlayerId)" @click="navigate(seed.PlayerId, seed.Player.full_name)"/>
                                </v-avatar>
                                <div style="width: 10%;" class="mx-3"><v-img :src="flagSrc(seed.Player.country)" rounded="lg"/></div>
                                <RouterLink class="hover-link" :class="{'strikethrough': seed.wd}" :to="{name: 'Player', params: {id: seed.PlayerId, name: seed.Player.full_name}}">{{ seed.Player.full_name }}</RouterLink></td>
                            <td :class="{'strikethrough': seed.wd}" class="text-center">{{ seed.rank }}</td>
                        </tr>
                    </tbody>
                </v-table>
            </v-col>
            <v-col cols="6">
                <v-table
                    v-if="edition.winner_pm"
                    hover
                    style="width: 90%"
                    class="mx-auto rounded-t-lg"
                    density="compact"
                    :class="{'rounded-t-lg': lda.length===0 && lls.length===0 && alts.length===0 && wds.length===0 && rets.length===0 && wos.length===0 && def.length===0,
                            'rounded-lg': lda.length > 0 || lls.length > 0 || alts.length > 0 || wds.length > 0 || rets.length > 0 || wos.length > 0 || def.length > 0
                        }"
                >
                    <thead>
                        <tr class="bg-indigo-accent-1">
                            <th></th>
                            <th class="font-weight-bold text-center">Prize money</th>
                            <th class="font-weight-bold text-center">Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="text-center">
                            <td class="font-weight-bold">WINNER</td>
                            <td>{{ formatCurrency(edition.currency, edition.winner_pm) }}</td>
                            <td>{{ edition.winner_pts }}</td>
                        </tr>
                        <tr class="text-center">
                            <td class="font-weight-bold">FINALIST</td>
                            <td>{{ formatCurrency(edition.currency, edition.finalist_pm) }}</td>
                            <td>{{ edition.finalist_pts }}</td>
                        </tr>
                        <tr class="text-center">
                            <td class="font-weight-bold">SEMIFINALIST</td>
                            <td>{{ formatCurrency(edition.currency, edition.semifinalist_pm) }}</td>
                            <td>{{ edition.semifinalist_pts }}</td>
                        </tr>
                        <tr class="text-center">
                            <td class="font-weight-bold">QUARTERFINALIST</td>
                            <td>{{ formatCurrency(edition.currency, edition.quarterfinalist_pm) }}</td>
                            <td>{{ edition.quarterfinalist_pts }}</td>
                        </tr>
                        <tr v-if="edition.r128_pm" class="text-center">
                            <td class="font-weight-bold">4TH ROUND</td>
                            <td>{{ formatCurrency(edition.currency, edition.r16_pm) }}</td>
                            <td>{{ edition.r16_pts }}</td>
                        </tr>
                        <tr v-if="edition.r64_pm" class="text-center">
                            <td class="font-weight-bold">3RD ROUND</td>
                            <td v-if="edition.r128_pm">{{ formatCurrency(edition.currency, edition.r32_pm) }}</td>
                            <td v-else>{{ formatCurrency(edition.currency, edition.r16_pm) }}</td>
                            <td v-if="edition.r128_pm">{{ edition.r32_pts }}</td>
                            <td v-else>{{ edition.r16_pts }}</td>
                        </tr>
                        <tr class="text-center">
                            <td class="font-weight-bold">2ND ROUND</td>
                            <td v-if="edition.r128_pm">{{ formatCurrency(edition.currency, edition.r64_pm) }}</td>
                            <td v-else-if="edition.r64_pm">{{ formatCurrency(edition.currency, edition.r32_pm) }}</td>
                            <td v-else>{{ formatCurrency(edition.currency, edition.r16_pm) }}</td>
                            <td v-if="edition.r128_pm">{{ edition.r64_pts }}</td>
                            <td v-else-if="edition.r64_pm">{{ edition.r32_pts }}</td>
                            <td v-else>{{ edition.r16_pts }}</td>
                        </tr>
                        <tr class="text-center">
                            <td class="font-weight-bold">1ST ROUND</td>
                            <td v-if="edition.r128_pm">{{ formatCurrency(edition.currency, edition.r128_pm) }}</td>
                            <td v-else-if="edition.r64_pm">{{ formatCurrency(edition.currency, edition.r64_pm) }}</td>
                            <td v-else>{{ formatCurrency(edition.currency, edition.r32_pm) }}</td>
                            <td v-if="edition.r128_pm">{{ edition.r128_pts }}</td>
                            <td v-else-if="edition.r64_pm">{{ edition.r64_pts }}</td>
                            <td v-else>{{ edition.r32_pts }}</td>
                        </tr>
                    </tbody>
                </v-table>
                <v-table
                    v-if="lda.length > 0 || lls.length > 0 || alts.length > 0 || wds.length > 0 || rets.length > 0 || wos.length > 0 || def.length > 0"
                    hover
                    style="width: 90%"
                    class="mx-auto"
                    :class="{'rounded-b-lg': edition.winner_pm, 'rounded-lg': !edition.winner_pm}"
                    density="compact"
                >
                    <thead v-if="lda.length > 0">
                        <tr class="bg-indigo-accent-1 text-center ">
                            <th colspan="2" class="font-weight-bold">Last direct acceptance</th>
                        </tr>
                    </thead>
                    <tbody v-if="lda.length > 0">
                        <tr>
                            <td class="d-flex align-center pl-7">
                                <v-avatar
                                    class="my-1"
                                    variant="outlined"
                                    size="small"
                                >
                                    <v-img v-if="lda[0].Player.headshot" :src="headshot(lda[0].PlayerId)" @click="navigate(lda[0].PlayerId, lda[0].Player.full_name)"/>
                                </v-avatar>
                                <div style="width: 10%;" class="mx-3"><v-img class="rounded-lg" :src="flagSrc(lda[0].Player.country)"/></div>
                                <RouterLink class="hover-link" :to="{name: 'Player', params: {id: lda[0].PlayerId, name: lda[0].Player.full_name}}">{{ lda[0].Player.full_name }}</RouterLink>
                            </td>
                            <td><span v-if="lda[0].status === 'PR'">P</span>{{ lda[0].rank }}</td>
                        </tr>
                    </tbody>
                    <thead v-if="lls.length > 0">
                        <tr class="bg-indigo-accent-1">
                            <th colspan="2" class="text-center font-weight-bold">Lucky losers</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="player in lls">
                            <td class="d-flex align-center pl-7">
                                <v-avatar
                                    class="my-1"
                                    variant="outlined"
                                    size="small"
                                >
                                    <v-img v-if="player.Player.headshot" :src="headshot(player.PlayerId)" @click="navigate(player.PlayerId, player.Player.full_name)"/>
                                </v-avatar>
                                <div style="width: 10%;" class="mx-3"><v-img :src="flagSrc(player.Player.country)" class='rounded-lg'/></div>
                                <RouterLink class="hover-link" :to="{name: 'Player', params: {id: player.PlayerId, name: player.Player.full_name}}">{{ player.Player.full_name }}</RouterLink>
                            </td>
                            <td></td>
                        </tr>
                    </tbody>
                    <thead v-if="alts.length > 0">
                        <tr class="bg-indigo-accent-1">
                            <th colspan="2" class="text-center font-weight-bold">Alternates</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="player in alts">
                            <td class="d-flex align-center pl-7">
                                <v-avatar
                                    class="my-1"
                                    variant="outlined"
                                    size="small"
                                >
                                    <v-img v-if="player.Player.headshot" :src="headshot(player.PlayerId)" @click="navigate(player.PlayerId, player.Player.full_name)"/>
                                </v-avatar>
                                <div style="width: 10%;" class="mx-3"><v-img :src="flagSrc(player.Player.country)" class='rounded-lg'/></div>
                                <RouterLink class="hover-link" :to="{name: 'Player', params: {id: player.PlayerId, name: player.Player.full_name}}">{{ player.Player.full_name }}</RouterLink>
                            </td>
                            <td></td>
                        </tr>
                    </tbody>
                    <thead v-if="wds.length > 0">
                        <tr class="bg-indigo-accent-1">
                            <th colspan="2" class="text-center font-weight-bold">Withdrawals</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="player in wds">
                            <td class="d-flex align-center pl-7">
                                <v-avatar
                                    class="my-1"
                                    variant="outlined"
                                    size="small"
                                >
                                    <v-img v-if="player.Player.headshot" :src="headshot(player.PlayerId)" @click="navigate(player.PlayerId, player.Player.full_name)"/>
                                </v-avatar>
                                <div style="width: 10%;" class="mx-3"><v-img :src="flagSrc(player.Player.country)" class='rounded-lg'/></div>
                                <RouterLink class="hover-link" :to="{name: 'Player', params: {id: player.PlayerId, name: player.Player.full_name}}">{{ player.Player.full_name }}</RouterLink>
                            </td>
                            <td v-if="player.wd === 'true'"></td>
                            <td v-else>{{ player.wd }}</td>
                        </tr>
                    </tbody>
                    <thead v-if="rets.length > 0">
                        <tr class="bg-indigo-accent-1">
                            <th colspan="2" class="text-center font-weight-bold">Retirements</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="player in rets">
                            <td class="d-flex align-center pl-7">
                                <v-avatar
                                    class="my-1"
                                    variant="outlined"
                                    size="small"
                                >
                                    <v-img v-if="player.Player.headshot" :src="headshot(player.PlayerId)" @click="navigate(player.PlayerId, player.Player.full_name)"/>
                                </v-avatar>
                                <div style="width: 10%;" class="mx-3"><v-img :src="flagSrc(player.Player.country)" class='rounded-lg'/></div>
                                <RouterLink class="hover-link" :to="{name: 'Player', params: {id: player.PlayerId, name: player.Player.full_name}}">{{ player.Player.full_name }}</RouterLink>
                            </td>
                            <td v-if="player.ret === 'true'"></td>
                            <td v-else>{{ player.ret }}</td>
                        </tr>
                    </tbody>
                    <thead v-if="wos.length > 0">
                        <tr class="bg-indigo-accent-1">
                            <th colspan="2" class="text-center font-weight-bold">Walkovers</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="player in wos">
                            <td class="d-flex align-center pl-7">
                                <v-avatar
                                    class="my-1"
                                    variant="outlined"
                                    size="small"
                                >
                                    <v-img v-if="player.Player.headshot" :src="headshot(player.PlayerId)" @click="navigate(player.PlayerId, player.Player.full_name)"/>
                                </v-avatar>
                                <div style="width: 10%;" class="mx-3"><v-img :src="flagSrc(player.Player.country)" class='rounded-lg'/></div>
                                <RouterLink class="hover-link" :to="{name: 'Player', params: {id: player.PlayerId, name: player.Player.full_name}}">{{ player.Player.full_name }}</RouterLink>
                            </td>
                            <td v-if="player.wo === 'true'"></td>
                            <td v-else>{{ player.wo }}</td>
                        </tr>
                    </tbody>
                    <thead v-if="def.length > 0">
                        <tr class="bg-indigo-accent-1">
                            <th colspan="2" class="text-center font-weight-bold">Defaults</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="player in def">
                            <td class="d-flex align-center pl-7">
                                <v-avatar
                                    class="my-1"
                                    variant="outlined"
                                    size="small"
                                >
                                    <v-img v-if="player.Player.headshot" :src="headshot(player.PlayerId)" @click="navigate(player.PlayerId, player.Player.full_name)"/>
                                </v-avatar>
                                <div style="width: 10%;" class="mx-3"><v-img :src="flagSrc(player.Player.country)" class='rounded-lg'/></div>
                                <RouterLink class="hover-link" :to="{name: 'Player', params: {id: player.PlayerId, name: player.Player.full_name}}">{{ player.Player.full_name }}</RouterLink>
                            </td>
                            <td>{{ player.defaulted === 'true' ? '' : player.defaulted }}</td>
                        </tr>
                    </tbody>
                </v-table>
            </v-col>
        </v-row>
    </v-container>
</template>