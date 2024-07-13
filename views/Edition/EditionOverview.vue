<script setup lang="ts">
import { useDisplay } from 'vuetify';
import EntryRow from '@/components/Edition/EntryRow.vue';
import EntryHeading from '@/components/Edition/EntryHeading.vue';
import { formatCurrency, headshot, flagSrc, encodeName } from '@/components/utils';
import type { EditionDetails } from '@/components/interfaces';

const { xl } = useDisplay()
</script>

<template>
    <v-container v-if="edition">
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