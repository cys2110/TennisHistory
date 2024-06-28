<script setup lang="ts">
import { ref, watch, type Ref } from 'vue';
import { useDisplay } from 'vuetify';
import { provideApolloClient, useQuery } from '@vue/apollo-composable';
import apolloClient from '@/apollo';
import { getEditionDetails } from '@/services/APICalls';
import EntryRow from '@/components/Edition/EntryRow.vue';
import EntryHeading from '@/components/Edition/EntryHeading.vue';
import { formatCurrency, headshot, flagSrc, encodeName } from '@/components/utils';
import type { EditionDetails } from '@/components/interfaces';

provideApolloClient(apolloClient)

const props = defineProps<{
    editionNo: string
}>()
const { xl } = useDisplay()

const { query, variables } = getEditionDetails(parseInt(props.editionNo))
const { result, loading, error} = useQuery(query, variables)

const edition: Ref<EditionDetails | null> = ref(null)
const prizeMoney: Ref<{round: string, pm: number, pts: number}[]> = ref([])

watch(result, (newResult) => {
    if (newResult) {
        edition.value = newResult.events[0]
        prizeMoney.value = [
            {
                round: 'WINNER',
                pm: newResult.events[0].winner_pm,
                pts: newResult.events[0].winner_pts
            },
            {
                round: 'FINALIST',
                pm: newResult.events[0].finalist_pm,
                pts: newResult.events[0].finalist_pts
            },
            {
                round: 'SEMIFINALIST',
                pm: newResult.events[0].semifinalist_pm,
                pts: newResult.events[0].semifinalist_pts
            },
            {
                round: 'QUARTERFINALIST',
                pm: newResult.events[0].quarterfinalist_pm,
                pts: newResult.events[0].quarterfinalist_pts
            },
            {
                round: 'ROUND OF 16',
                pm: newResult.events[0].r16_pm,
                pts: newResult.events[0].r16_pts
            },
            {
                round: 'ROUND OF 32',
                pm: newResult.events[0].r32_pm,
                pts: newResult.events[0].r32_pts
            },
            {
                round: 'ROUND OF 64',
                pm: newResult.events[0].r64_pm,
                pts: newResult.events[0].r64_pts
            },
            {
                round: 'ROUND OF 128',
                pm: newResult.events[0].r128_pm,
                pts: newResult.events[0].r128_pts
            }
        ]
    }
}, {immediate: true})

watch(error, (newError) => {
    if (newError) {
        console.error(newError)
    }
})
</script>

<template>
    <v-container v-if="edition">
        <v-row>
            <v-col class="sm:flex justify-between">
                <div class="w-100 mx-1 text-xs lg:text-sm">
                    <div
                        v-if="edition.venue.name"
                        class="my-2 bg-indigo-800 text-zinc-300 py-1 px-3 rounded-lg flex justify-between"
                    >
                        <span>Venue</span>
                        <span class="text-right">{{ edition.venue.name }}</span>
                    </div>
                    <div class="my-2 bg-indigo-800 text-zinc-300 py-1 px-3 rounded-lg flex justify-between">
                        <div>City</div>
                        <div>{{ edition.venue.city }}</div>
                    </div>
                    <div class="my-2 bg-indigo-800 text-zinc-300 py-1 px-3 rounded-lg flex justify-between">
                        <div>Surface</div>
                        <div>{{ edition.surface.environment }} {{ edition.surface.surface }}<div v-if="edition.surface.hard_type">({{ edition.surface.hard_type }})</div></div>
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
                        v-if="edition.supervisors.length > 0"
                        class="my-2 bg-indigo-800 text-zinc-300 py-1 px-3 rounded-lg flex justify-between"
                    >
                        <div class="flex items-center">{{ edition.supervisors?.length === 1 ? 'Supervisor' : 'Supervisors' }}</div>
                        <div>
                            <div
                                v-for="supervisor in edition.supervisors"
                                :key="supervisor.id"
                                class="text-right"
                            >
                                {{ supervisor.id }}
                            </div>
                        </div>
                    </div>
                </div>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-table
                    v-if="edition.seeds.length > 0"
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
                            v-for="seed in edition.seeds"
                            :key="seed.seed"
                        >
                            <td class="text-center">{{ seed.seed }}</td>
                            <td class="flex items-center">
                                <div class="mx-1">
                                    <flag-img
                                        class="w-[2rem]"
                                        :src="flagSrc(seed.player.country.id)"
                                        :alt="seed.player.country.name"
                                    />
                                </div>
                                <div class="mx-1">
                                    <v-avatar size="small">
                                        <v-img
                                            :src="headshot(seed.player.id)"
                                            :alt="seed.player.full_name"
                                        />
                                    </v-avatar>
                                </div>
                                <div class="mx-1">
                                    <router-link
                                        class="hover-link"
                                        :class="{'strikethrough': seed.wd}"
                                        :to="{name: 'Player', params: {id: seed.player.id, name: encodeName(seed.player.full_name)}}"
                                    >
                                        {{ seed.player.full_name }}
                                    </router-link>
                                </div>
                                <div>{{ seed.rank }}</div>
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
                    v-if="edition.lda"
                    class="bg-transparent rounded-xl my-5"
                    fixed-header
                    hover
                    density="compact"
                >
                    <EntryHeading heading="Last direct acceptance" />
                    <tbody class="text-xs text-zinc-300">
                        <tr>
                            <td class="flex items-center text-nowrap">
                                <div class="mx-1">
                                    <flag-img
                                        class="w-[2rem]"
                                        :src="flagSrc(edition.lda.player.country.id)"
                                        :alt="edition.lda.player.country.name"
                                    />
                                </div>
                                <div class="mx-1">
                                    <v-avatar size="small">
                                        <v-img
                                        :src="headshot(edition.lda.player.id)"
                                        :alt="edition.lda.player.full_name"
                                        />
                                    </v-avatar>
                                </div>
                                <div class="mx-1">
                                    <router-link
                                        class="hover-link"
                                        :to="{name: 'Player', params: {id: edition.lda.player.id, name: edition.lda.player.full_name}}"
                                    >
                                        {{ edition.lda.player.full_name }}
                                    </router-link>
                                </div>
                            </td>
                            <td>{{ edition.lda.status === 'PR' ? 'P' : '' }}{{ edition.lda.rank || '' }}
                            </td>
                        </tr>
                    </tbody>
                </v-table>
                <v-table
                    v-if="edition.lls.length > 0"
                    class="bg-transparent rounded-xl my-5"
                    fixed-header
                    hover
                    density="compact"
                >
                    <EntryHeading heading="Lucky losers" />
                    <tbody class="text-xs text-zinc-300">
                        <EntryRow
                            v-for="ll in edition.lls"
                            :key="ll.id"
                            :player="ll"
                        >
                        </EntryRow>
                    </tbody>
                </v-table>
                <v-table
                    v-if="edition.alts.length > 0"
                    class="bg-transparent rounded-xl my-5"
                    fixed-header
                    hover
                    density="compact"
                >
                    <EntryHeading heading="Alternates" />
                    <tbody class="text-xs text-zinc-300">
                        <EntryRow
                            v-for="alt in edition.alts"
                            :key="alt.id"
                            :player="alt"
                        >
                        </EntryRow>
                    </tbody>
                </v-table>
                <v-table
                    v-if="edition.wds.length > 0"
                    class="bg-transparent rounded-xl my-5"
                    fixed-header
                    hover
                    density="compact"
                >
                    <EntryHeading heading="Withdrawals" />
                    <tbody class="text-xs text-zinc-300">
                        <EntryRow
                            v-for="wd in edition.wds"
                            :key="wd.player.id"
                            :player="wd.player"
                        >
                        </EntryRow>
                    </tbody>
                </v-table>
                <v-table
                    v-if="edition.rets.length > 0"
                    class="bg-transparent rounded-xl my-5"
                    fixed-header
                    hover
                    density="compact"
                >
                    <EntryHeading heading="Retirements" />
                    <tbody class="text-xs text-zinc-300">
                        <EntryRow
                            v-for="ret in edition.rets"
                            :key="ret.player.id"
                            :player="ret.player"
                        >
                            <template #reason>{{ ret.reason !== 'true' ? ret.reason : '' }}</template>
                        </EntryRow>
                    </tbody>
                </v-table>
                <v-table
                    v-if="edition.wos.length > 0"
                    class="bg-transparent rounded-xl my-5"
                    fixed-header
                    hover
                    density="compact"
                >
                    <EntryHeading heading="Walkovers" />
                    <tbody class="text-xs text-zinc-300">
                        <EntryRow
                            v-for="wo in edition.wos"
                            :key="wo.player.id"
                            :player="wo.player"
                        >
                            <template #reason>{{ wo.reason !== 'true' ? wo.reason : '' }}</template>
                        </EntryRow>
                    </tbody>
                </v-table>
                <v-table
                    v-if="edition.defs.length > 0"
                    class="bg-transparent rounded-xl my-5"
                    fixed-header
                    hover
                    density="compact"
                >
                    <EntryHeading heading="Defaults" />
                    <tbody class="text-xs text-zinc-300">
                        <EntryRow
                            v-for="def in edition.defs"
                            :key="def.player.id"
                            :player="def.player"
                        >
                            <template #reason>{{ def.reason !== 'true' ? def.reason : '' }}</template>
                        </EntryRow>
                    </tbody>
                </v-table>
            </v-col>
        </v-row>
    </v-container>
</template>