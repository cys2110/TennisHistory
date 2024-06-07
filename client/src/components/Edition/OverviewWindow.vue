<script setup lang="ts">
import { useDisplay } from 'vuetify';
import EntryRow from './EntryRow.vue';
import EntryHeading from './EntryHeading.vue';
import { formatCurrency, headshot, flagSrc, encodeName } from '../utils';
import type { EditionDetails, Entries } from '../interfaces';

const props = defineProps<{
    edition: EditionDetails
}>()
const { xl } = useDisplay()

const seedsArray = props.edition.Entries.filter(
    (entry): entry is Entries & { seed: number } => entry.seed !== null && entry.seed !== undefined
).sort((a, b) => a.seed - b.seed)
const ldaArray = props.edition.Entries.filter(entry => entry.lda)
const llsArray = props.edition.Entries.filter(entry => entry.status === 'LL')
const altsArray = props.edition.Entries.filter(entry => entry.status === 'Alt')
const wdsArray = props.edition.Entries.filter(entry => entry.wd)
const retsArray = props.edition.Entries.filter(entry => entry.ret)
const wosArray = props.edition.Entries.filter(entry => entry.wo)
const defsArray = props.edition.Entries.filter(entry => entry.defaulted)

const prizeMoney = [
    {
        round: 'WINNER',
        pm: props.edition.pm,
        pts: props.edition.winner_pts
    },
    {
        round: 'FINALIST',
        pm: props.edition.finalist_pm,
        pts: props.edition.finalist_pts
    },
    {
        round: 'SEMIFINALIST',
        pm: props.edition.semifinalist_pm,
        pts: props.edition.semifinalist_pts
    },
    {
        round: 'QUARTERFINALIST',
        pm: props.edition.quarterfinalist_pm,
        pts: props.edition.quarterfinalist_pts
    },
    {
        round: 'ROUND OF 16',
        pm: props.edition.r16_pm,
        pts: props.edition.r16_pts
    },
    {
        round: 'ROUND OF 32',
        pm: props.edition.r32_pm,
        pts: props.edition.r32_pts
    },
    {
        round: 'ROUND OF 64',
        pm: props.edition.r64_pm,
        pts: props.edition.r64_pts
    },
    {
        round: 'ROUND OF 128',
        pm: props.edition.r128_pm,
        pts: props.edition.r128_pts
    }
]
</script>

<template>
    <v-container>
        <v-row>
            <v-col class="sm:flex justify-between">
                <div class="w-100 mx-1 text-xs lg:text-sm">
                    <div
                        v-if="edition.venue"
                        class="my-2 bg-indigo-800 text-zinc-300 py-1 px-3 rounded-lg flex justify-between"
                    >
                        <span>Venue</span>
                        <span class="text-right">{{ edition.venue }}</span>
                    </div>
                    <div class="my-2 bg-indigo-800 text-zinc-300 py-1 px-3 rounded-lg flex justify-between">
                        <div>City</div>
                        <div>{{ edition.city }}</div>
                    </div>
                    <div class="my-2 bg-indigo-800 text-zinc-300 py-1 px-3 rounded-lg flex justify-between">
                        <div>Surface</div>
                        <div>{{ edition.environment }} {{ edition.surface }}<div v-if="edition.hard_type">({{ edition.hard_type }})</div></div>
                    </div>
                </div>
                <div class="w-100 mx-1 text-xs lg:text-sm">
                    <div
                        v-if="edition.pm"
                        class="my-2 bg-indigo-800 text-zinc-300 py-1 px-3 rounded-lg flex justify-between"
                    >
                        <div>Prize money</div>
                        <div>{{ formatCurrency(edition.currency, edition.pm) }}</div>
                    </div>
                    <div
                        v-if="edition.tfc"
                        class="my-2 bg-indigo-800 text-zinc-300 py-1 px-3 rounded-lg flex justify-between items-center"
                    >
                        <div>Total financial commitment</div>
                        <div>{{ formatCurrency(edition.currency, edition.tfc) }}</div>
                    </div>
                    <div
                        v-if="edition.supervisors"
                        class="my-2 bg-indigo-800 text-zinc-300 py-1 px-3 rounded-lg flex justify-between"
                    >
                        <div class="flex items-center">{{ edition.supervisors?.length === 1 ? 'Supervisor' : 'Supervisors' }}</div>
                        <div>
                            <div
                                v-for="supervisor in edition.supervisors"
                                :key="supervisor"
                                class="text-right"
                            >
                                {{ supervisor }}
                            </div>
                        </div>
                    </div>
                </div>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-table
                    v-if="seedsArray.length > 0"
                    class="bg-transparent rounded-xl"
                    fixed-header
                    hover
                    :height="xl ? '' : '30rem'"
                >
                    <thead class="text-xs text-zinc-300">
                        <tr>
                            <th class="!font-bold text-center !bg-indigo-800">Seed</th>
                            <th class="!font-bold text-center !bg-indigo-800">Player</th>
                            <th  class="!font-bold text-center !bg-indigo-800">Rank</th>
                        </tr>
                    </thead>
                    <tbody class="text-xs text-zinc-300">
                        <tr
                            v-for="seed in seedsArray"
                            :key="seed.Player.id"
                        >
                            <td class="text-center">{{ seed.seed }}</td>
                            <td class="flex items-center">
                                <div class="mx-1">
                                    <flag-img
                                        class="w-[2rem]"
                                        :src="flagSrc(seed.Player.country)"
                                        :alt="seed.Player.country"
                                    />
                                </div>
                                <div class="mx-1">
                                    <v-avatar size="small">
                                        <v-img
                                            :src="headshot(seed.Player.id)"
                                            :alt="seed.Player.full_name"
                                        />
                                    </v-avatar>
                                </div>
                                <div class="mx-1">
                                    <router-link
                                        class="hover-link"
                                        :to="{name: 'Player', params: {id: seed.Player.id, name: encodeName(seed.Player.full_name)}}"
                                    >
                                        {{ seed.Player.full_name }}
                                    </router-link>
                                </div>
                            </td>
                            <td
                                class="text-center"
                                :class="{'strikethrough': seed.wd}"
                            >
                                {{ seed.rank }}
                            </td>
                        </tr>
                    </tbody>
                </v-table>
            </v-col>
            <v-col>
                <v-table
                    v-if="edition.winner_pm"
                    class="bg-transparent rounded-xl mb-3"
                    fixed-header
                    hover
                    density="compact"
                >
                    <thead class="text-xs text-zinc-300">
                        <tr>
                            <th class="!font-bold text-center !bg-indigo-800"></th>
                            <th class="!font-bold text-center !bg-indigo-800">Prize money</th>
                            <th class="!font-bold text-center !bg-indigo-800">Points</th>
                        </tr>
                    </thead>
                    <tbody class="text-xs text-zinc-300">
                        <tr
                            v-for="row in prizeMoney"
                            :key="row.round"
                        >
                            <td v-if="row.pm || row.pts">{{ row.round }}</td>
                            <td
                                v-if="row.pm || row.pts"
                                class="text-center"
                            >
                                {{ row.pm ? formatCurrency(edition.currency, row.pm) : '—' }}
                            </td>
                            <td
                                v-if="row.pm || row.pts"
                                class="text-center"
                            >
                                {{ row.pts ?? 0 }}
                            </td>
                        </tr>
                    </tbody>
                </v-table>
                <v-table
                    v-if="ldaArray.length > 0"
                    class="bg-transparent rounded-xl my-5"
                    fixed-header
                    hover
                    density="compact"
                >
                    <EntryHeading heading="Last direct acceptance" />
                    <tbody class="text-xs text-zinc-300">
                        <EntryRow
                            v-for="player in ldaArray"
                            :key="player.Player.id"
                            :player
                        >
                            <template #reason>{{ player.status === 'PR' ? 'P' : '' }}{{ player.lda ?? '' }}</template>
                        </EntryRow>
                    </tbody>
                </v-table>
                <v-table
                    v-if="llsArray.length > 0"
                    class="bg-transparent rounded-xl my-5"
                    fixed-header
                    hover
                    density="compact"
                >
                    <EntryHeading heading="Lucky losers" />
                    <tbody class="text-xs text-zinc-300">
                        <EntryRow
                            v-for="player in llsArray"
                            :key="player.Player.id"
                            :player
                        >
                        </EntryRow>
                    </tbody>
                </v-table>
                <v-table
                    v-if="altsArray.length > 0"
                    class="bg-transparent rounded-xl my-5"
                    fixed-header
                    hover
                    density="compact"
                >
                    <EntryHeading heading="Alternates" />
                    <tbody class="text-xs text-zinc-300">
                        <EntryRow
                            v-for="player in altsArray"
                            :key="player.Player.id"
                            :player
                        >
                        </EntryRow>
                    </tbody>
                </v-table>
                <v-table
                    v-if="wdsArray.length > 0"
                    class="bg-transparent rounded-xl my-5"
                    fixed-header
                    hover
                    density="compact"
                >
                    <EntryHeading heading="Withdrawals" />
                    <tbody class="text-xs text-zinc-300">
                        <EntryRow
                            v-for="player in wdsArray"
                            :key="player.Player.id"
                            :player
                        >
                        </EntryRow>
                    </tbody>
                </v-table>
                <v-table
                    v-if="retsArray.length > 0"
                    class="bg-transparent rounded-xl my-5"
                    fixed-header
                    hover
                    density="compact"
                >
                    <EntryHeading heading="Retirements" />
                    <tbody class="text-xs text-zinc-300">
                        <EntryRow
                            v-for="player in retsArray"
                            :key="player.Player.id"
                            :player
                        >
                            <template #reason>{{ player.ret !== 'true' ? player.ret : '' }}</template>
                        </EntryRow>
                    </tbody>
                </v-table>
                <v-table
                    v-if="wosArray.length > 0"
                    class="bg-transparent rounded-xl my-5"
                    fixed-header
                    hover
                    density="compact"
                >
                    <EntryHeading heading="Walkovers" />
                    <tbody class="text-xs text-zinc-300">
                        <EntryRow
                            v-for="player in wosArray"
                            :key="player.Player.id"
                            :player
                        >
                            <template #reason>{{ player.wo !== 'true' ? player.wo : '' }}</template>
                        </EntryRow>
                    </tbody>
                </v-table>
                <v-table
                    v-if="defsArray.length > 0"
                    class="bg-transparent rounded-xl my-5"
                    fixed-header
                    hover
                    density="compact"
                >
                    <EntryHeading heading="Defaults" />
                    <tbody class="text-xs text-zinc-300">
                        <EntryRow
                            v-for="player in defsArray"
                            :key="player.Player.id"
                            :player
                        >
                            <template #reason>{{ player.defaulted !== 'true' ? player.defaulted : '' }}</template>
                        </EntryRow>
                    </tbody>
                </v-table>
            </v-col>
        </v-row>
    </v-container>
</template>