<script setup>
import { formatCurrency, joinArray, headshot, flagSrc } from '@/components/utils';
import { useRouter, RouterLink } from 'vue-router';
import { ref } from 'vue'
import { useDisplay } from 'vuetify/lib/framework.mjs';
import EntryInfoRow from './EntryInfoRow.vue';
import EntryInfoHeading from './EntryInfoHeading.vue';
import EditionPmRow from './EditionPmRow.vue';

const props = defineProps(['edition'])
const router = useRouter()
const { mdAndDown } = useDisplay()

const seedsArray = props.edition.Entries.filter(entry => entry.seed)
const seeds = ref(seedsArray.toSorted((a, b) => {
    return a.seed - b.seed
}))
const ldaArray = props.edition.Entries.filter(entry => entry.lda)
const llsArray = props.edition.Entries.filter(entry => entry.status === 'LL')
const altsArray = props.edition.Entries.filter(entry => entry.status === 'Alt')
const wdsArray = props.edition.Entries.filter(entry => entry.wd)
const retsArray = props.edition.Entries.filter(entry => entry.ret)
const wosArray = props.edition.Entries.filter(entry => entry.wo)
const defsArray = props.edition.Entries.filter(entry => entry.defaulted)

const navigate = (id, name) => {
    router.push({name: 'Player', params: { id: id, name: name}})
}
</script>

<template>
    <v-container>
        <v-row>
            <v-col cols="12" sm="6">
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
            <v-col cols="12" sm="6">
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
            <v-col cols="12" sm="6">
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
                                <v-avatar
                                    :size="xs ? 'x-small' : 'default'"
                                >
                                    <v-img v-if="seed.Player.headshot" :src="headshot(seed.PlayerId)" @click="navigate(seed.PlayerId, seed.Player.full_name)"/>
                                </v-avatar>
                                <div :style="mdAndDown ? 'min-width: 30%' : 'width: 10%'" class="mx-3"><flag-img :src="flagSrc(seed.Player.country)"/></div>
                                <RouterLink class="hover-link" :class="{'strikethrough': seed.wd}" :to="{name: 'Player', params: {id: seed.PlayerId, name: seed.Player.full_name}}">{{ seed.Player.full_name }}</RouterLink></td>
                            <td :class="{'strikethrough': seed.wd}" class="text-center">{{ seed.rank }}</td>
                        </tr>
                    </tbody>
                </v-table>
            </v-col>
            <v-col cols="12" sm="6">
                <v-table
                    v-if="edition.winner_pm"
                    hover
                    style="width: 90%"
                    class="mx-auto rounded-t-lg"
                    density="compact"
                    :class="{'rounded-t-lg': ldaArray.length===0 && llsArray.length===0 && altsArray.length===0 && wdsArray.length===0 && retsArray.length===0 && wosArray.length===0 && defsArray.length===0,
                            'rounded-lg': ldaArray.length > 0 || llsArray.length > 0 || altsArray.length > 0 || wdsArray.length > 0 || retsArray.length > 0 || wosArray.length > 0 || defsArray.length > 0
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
                        <EditionPmRow>
                            <template #round>WINNER</template>
                            <template #pm>{{ formatCurrency(edition.currency, edition.winner_pm) }}</template>
                            <template #pts>{{ edition.winner_pts }}</template>
                        </EditionPmRow>
                        <EditionPmRow>
                            <template #round>FINALIST</template>
                            <template #pm>{{ formatCurrency(edition.currency, edition.finalist_pm) }}</template>
                            <template #pts>{{ edition.finalist_pts }}</template>
                        </EditionPmRow>
                        <EditionPmRow>
                            <template #round>SEMIFINALIST</template>
                            <template #pm>{{ formatCurrency(edition.currency, edition.semifinalist_pm) }}</template>
                            <template #pts>{{ edition.semifinalist_pts }}</template>
                        </EditionPmRow>
                        <EditionPmRow>
                            <template #round>QUARTERFINALIST</template>
                            <template #pm>{{ formatCurrency(edition.currency, edition.quarterfinalist_pm) }}</template>
                            <template #pts>{{ edition.quarterfinalist_pts }}</template>
                        </EditionPmRow>
                        <EditionPmRow v-if="edition.r128_pm">
                            <template #round>4TH ROUND</template>
                            <template #pm>{{ formatCurrency(edition.currency, edition.r16_pm) }}</template>
                            <template #pts>{{ edition.r16_pts }}</template>
                        </EditionPmRow>
                        <EditionPmRow v-if="edition.r64_pm">
                            <template #round>3RD ROUND</template>
                            <template #pm>{{ edition.r128_pm ? formatCurrency(edition.currency, edition.r32_pm) : formatCurrency(edition.currency, edition.r16_pm) }}</template>
                            <template #pts>{{ edition.r128_pm ? edition.r32_pts : edition.r16_pts }}</template>
                        </EditionPmRow>
                        <EditionPmRow>
                            <template #round>2ND ROUND</template>
                            <template #pm>{{ edition.r128_pm ? formatCurrency(edition.currency, edition.r64_pm) : edition.r64_pm ? formatCurrency(edition.currency, edition.r32_pm) : formatCurrency(edition.currency, edition.r16_pm) }}</template>
                            <template #pts>{{ edition.r128_pm ? edition.r64_pts : edition.r64_pm ? edition.r32_pts : edition.r16_pts }}</template>
                        </EditionPmRow>
                        <EditionPmRow>
                            <template #round>1ST ROUND</template>
                            <template #pm>{{ edition.r128_pm ? formatCurrency(edition.currency, edition.r128_pm) : edition.r64_pm ? formatCurrency(edition.currency, edition.r64_pm) : formatCurrency(edition.currency, edition.r32_pm) }}</template>
                            <template #pts>{{ edition.r128_pm ? edition.r128_pts : edition.r64_pm ? edition.r64_pts : edition.r32_pts }}</template>
                        </EditionPmRow>
                    </tbody>
                </v-table>
                <v-table
                    v-if="ldaArray.length > 0 || llsArray.length > 0 || altsArray.length > 0 || wdsArray.length > 0 || retsArray.length > 0 || wosArray.length > 0 || defsArray.length > 0"
                    hover
                    style="width: 90%"
                    class="mx-auto"
                    :class="{'rounded-b-lg': edition.winner_pm, 'rounded-lg': !edition.winner_pm}"
                    density="compact"
                >
                    <thead v-if="ldaArray.length > 0">
                        <EntryInfoHeading>
                            <template #heading>Last direct acceptance</template>
                        </EntryInfoHeading>
                    </thead>
                    <tbody v-if="ldaArray.length > 0">
                        <EntryInfoRow v-for="player in ldaArray" :key="player.id" :player>
                            <template #reason>{{ player.status === 'PR' ? 'P' : null }}{{ player.lda }}</template>
                        </EntryInfoRow>
                    </tbody>
                    <thead v-if="llsArray.length > 0">
                        <EntryInfoHeading>
                            <template #heading>Lucky Losers</template>
                        </EntryInfoHeading>
                    </thead>
                    <tbody>
                        <EntryInfoRow v-for="player in llsArray" :key="player.id" :player></EntryInfoRow>
                    </tbody>
                    <thead v-if="altsArray.length > 0">
                        <EntryInfoHeading>
                            <template #heading>Alternates</template>
                        </EntryInfoHeading>
                    </thead>
                    <tbody>
                        <EntryInfoRow v-for="player in altsArray" :key="player.id" :player></EntryInfoRow>
                    </tbody>
                    <thead v-if="wdsArray.length > 0">
                        <EntryInfoHeading>
                            <template #heading>Withdrawals</template>
                        </EntryInfoHeading>
                    </thead>
                    <tbody>
                        <EntryInfoRow v-for="player in wdsArray" :key="player.id" :player>
                            <template #reason>{{ player.wd !== 'true' ? player.wd : null }}</template>
                        </EntryInfoRow>
                    </tbody>
                    <thead v-if="retsArray.length > 0">
                        <EntryInfoHeading>
                            <template #heading>Retirements</template>
                        </EntryInfoHeading>
                    </thead>
                    <tbody>
                        <EntryInfoRow v-for="player in retsArray" :key="player.id" :player>
                            <template #reason>{{ player.ret !== 'true' ? player.ret : null }}</template>
                        </EntryInfoRow>
                    </tbody>
                    <thead v-if="wosArray.length > 0">
                        <EntryInfoHeading>
                            <template #heading>Walkovers</template>
                        </EntryInfoHeading>
                    </thead>
                    <tbody>
                        <EntryInfoRow v-for="player in wosArray" :key="player.id" :player>
                            <template #reason>{{ player.wo !== 'true' ? player.wo : null }}</template>
                        </EntryInfoRow>
                    </tbody>
                    <thead v-if="defsArray.length > 0">
                        <EntryInfoHeading>
                            <template #heading>Defaults</template>
                        </EntryInfoHeading>
                    </thead>
                    <tbody>
                        <EntryInfoRow v-for="player in defsArray" :key="player.id" :player>
                            <template #reason>{{ player.default !== 'true' ? player.defaulted : null }}</template>
                        </EntryInfoRow>
                    </tbody>
                </v-table>
            </v-col>
        </v-row>
    </v-container>
</template>