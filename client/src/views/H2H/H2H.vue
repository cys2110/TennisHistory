<script setup lang="ts">
import { ref, watch, type Ref } from 'vue';
import { useDisplay } from 'vuetify';
import apolloClient from '@/apollo';
import { provideApolloClient, useQuery } from '@vue/apollo-composable';
import { DateTime } from 'luxon'
import { getH2H } from '@/services/H2HService';
import type { H2H } from '@/utils/interfaces';
import * as func from '@/utils/functions';
import PlayerStatItem from '@/components/H2H/PlayerStatItem.vue';
import H2HItem from '@/components/H2H/H2HItem.vue';

provideApolloClient(apolloClient)
const { mdAndUp, smAndUp } = useDisplay()

const props = defineProps<{
    p1Id: string,
    p2Id: string,
    p1Name: string,
    p2Name: string
}>()

const h2h: Ref<H2H | null> = ref(null)

const { query, variables } = getH2H(props.p1Id, props.p2Id)
const { result, loading, error} = useQuery(query, variables)

watch(result, (newResult) => {
    if (newResult) {
        h2h.value = newResult
    }
}, {immediate: true})

watch(error, (newError) => {
    if (newError) {
        console.error(newError)
    }
})

const updateDocumentTitle = () => {
    document.title = `${func.unencodeName(props.p1Name)} v. ${func.unencodeName(props.p2Name)} | TennisHistory`
}

watch(() => [props.p1Name, props.p2Name], () => {
    updateDocumentTitle()
}, {immediate: true})
</script>

<template>
    <v-sheet
        class="text-zinc-300 w-5/6 md:w-2/3 mx-auto my-10 bg-transparent"
    >
        <v-container
            v-if="h2h"
        >
            <v-row>
                <v-col
                    cols="4"
                >
                    <v-img
                        class="border-2 border-zinc-400 mx-auto my-3 sm:w-5/6 md:w-2/3"
                        :src="func.headshot(h2h.p1[0].id)"
                        :alt="h2h.p1[0].full_name"
                        rounded="circle"
                    />
                </v-col>
                <v-col
                    class="flex items-center justify-center"
                    cols="4"
                >
                    <div
                        class="text-xl text-zinc-300 flex flex-col items-center"
                    >
                        <span>
                            {{ h2h.p1Wins.count }}
                        </span>
                        <span>
                            {{ func.percentage(h2h.p1Wins.count, h2h.p2Wins.count + h2h.p1Wins.count).toFixed(0) }}%
                        </span>
                    </div>
                    <div
                        class="mx-3"
                    >
                        <v-progress-circular
                            :size="mdAndUp ? 200 : smAndUp ? 100 : 50"
                            color="#3730a3"
                            bg-color="#166534"
                            :model-value="func.percentage(h2h.p1Wins.count, h2h.p1Wins.count + h2h.p2Wins.count)"
                            rotate="120"
                        >
                            <div
                                class="text-zinc-300 text-lg text-center"
                            >
                                {{ h2h.p1Wins.count + h2h.p2Wins.count }}
                                <br>
                                matches
                                <br>
                                played
                            </div>
                        </v-progress-circular>
                    </div>
                    <div
                        class="text-xl text-zinc-300 flex flex-col items-center"
                    >
                        <span>
                            {{ h2h.p2Wins.count }}
                        </span>
                        <span>
                            {{ func.percentage(h2h.p2Wins.count, h2h.p2Wins.count + h2h.p1Wins.count).toFixed(0) }}%
                        </span>
                    </div>
                </v-col>
                <v-col
                    cols="4"
                >
                    <v-img
                        class="border-2 border-zinc-400 mx-auto my-3 sm:w-5/6 md:w-2/3"
                        :src="func.headshot(h2h.p2[0].id)"
                        :alt="h2h.p2[0].full_name"
                        rounded="circle"
                    />
                </v-col>
            </v-row>
            <v-row>
                <v-col
                    class="flex-col items-center"
                    cols="4"
                >
                    <div
                        class="sm:!flex sm:!justify-center bg-indigo-800 p-2 rounded-xl"
                    >
                        <div>
                            <flag-img
                                v-if="h2h.p1[0].country"
                                class="w-[2rem] mx-auto my-1"
                                :src="func.flag(h2h.p1[0].country.id)"
                                :alt="func.flag(h2h.p1[0].country.name)"
                            />
                        </div>
                        <div
                            class="text-center text-lg sm:mx-1"
                        >
                            <router-link
                                class="hover-link uppercase font-bold"
                                :to="{name: 'Player', params: {id: h2h.p1[0].id, name: func.encodeName(h2h.p1[0].full_name)}}"
                            >
                                {{ h2h.p1[0].full_name }}
                            </router-link>
                        </div>
                    </div>
                </v-col>
                <v-spacer/>
                <v-col
                    class="flex-col items-center"
                    cols="4"
                >
                    <div
                        class="sm:!flex sm:!justify-center bg-green-800 p-2 rounded-xl"
                    >
                        <div>
                            <flag-img
                                v-if="h2h.p2[0].country"
                                class="w-[2rem] mx-auto my-1"
                                :src="func.flag(h2h.p2[0].country.id)"
                                :alt="func.flag(h2h.p2[0].country.name)"
                            />
                        </div>
                        <div
                            class="text-center text-lg sm:mx-1"
                        >
                            <router-link
                                class="hover-link uppercase font-bold"
                                :to="{name: 'Player', params: {id: h2h.p2[0].id, name: func.encodeName(h2h.p2[0].full_name)}}"
                            >
                                {{ h2h.p2[0].full_name }}
                            </router-link>
                        </div>
                    </div>
                </v-col>
            </v-row>
            <v-row>
                <v-col
                    cols="4"
                >
                    <v-card
                        v-if="mdAndUp"
                        class="p-3 text-zinc-300 bg-indigo-800"
                        rounded="xl"
                    >
                        <PlayerStatItem>
                            <template #field>DOB</template>
                            <template #value>{{ h2h.p1[0].dob ? DateTime.fromISO(h2h.p1[0].dob).setLocale('gb').toFormat('dd LLLL yyyy') : 'Unknown' }}</template>
                        </PlayerStatItem>
                        <PlayerStatItem>
                            <template #field>Height</template>
                            <template #value>{{ h2h.p1[0].height_cm ? `${h2h.p1[0].height_cm} cm (${func.convertToFt(h2h.p1[0].height_cm)})` : 'Unknown' }}</template>
                        </PlayerStatItem>
                        <PlayerStatItem>
                            <template #field>Plays</template>
                            <template #value>{{ h2h.p1[0].rh !== null ? func.plays(h2h.p1[0].rh) : 'Unknown' }}</template>
                        </PlayerStatItem>
                        <PlayerStatItem>
                            <template #field>Backhand</template>
                            <template #value>{{ h2h.p1[0].bh1 !== null ? func.bh(h2h.p1[0].bh1) : 'Unknown' }}</template>
                        </PlayerStatItem>
                        <PlayerStatItem>
                            <template #field>Turned pro</template>
                            <template #value>{{ h2h.p1[0].turned_pro.id }}</template>
                        </PlayerStatItem>
                    </v-card>
                </v-col>
                <v-col
                    cols="12"
                    md="4"
                >
                    <v-card
                        variant="text"
                    >
                        <H2HItem v-if="!mdAndUp">
                            <template #p1>{{ h2h.p1[0].dob ? DateTime.fromISO(h2h.p1[0].dob).setLocale('gb').toLocaleString(DateTime.DATE_FULL) : 'Unknown' }}</template>
                            <template #metric>DOB</template>
                            <template #p2>{{ h2h.p2[0].dob ? DateTime.fromISO(h2h.p2[0].dob).setLocale('gb').toLocaleString(DateTime.DATE_FULL) : 'Unknown' }}</template>
                        </H2HItem>
                        <H2HItem v-if="!mdAndUp">
                            <template #p1>{{ h2h.p1[0].height_cm ? `${h2h.p1[0].height_cm} cm (${func.convertToFt(h2h.p1[0].height_cm)})` : 'Unknown' }}</template>
                            <template #metric>Height</template>
                            <template #p2>{{ h2h.p2[0].height_cm ? `${h2h.p2[0].height_cm} cm (${func.convertToFt(h2h.p2[0].height_cm)})` : 'Unknown' }}</template>
                        </H2HItem>
                        <H2HItem v-if="!mdAndUp">
                            <template #p1>{{ h2h.p1[0].rh !== null ? func.plays(h2h.p1[0].rh) : 'Unknown' }}</template>
                            <template #metric>Plays</template>
                            <template #p2>{{ h2h.p2[0].rh !== null ? func.plays(h2h.p2[0].rh) : 'Unknown' }}</template>
                        </H2HItem>
                        <H2HItem v-if="!mdAndUp">
                            <template #p1>{{ h2h.p1[0].bh1 !== null ? func.bh(h2h.p1[0].bh1) : 'Unknown' }}</template>
                            <template #metric>Backhand</template>
                            <template #p2>{{ h2h.p2[0].bh1 !== null ? func.bh(h2h.p2[0].bh1) : 'Unknown' }}</template>
                        </H2HItem>
                        <H2HItem v-if="!mdAndUp">
                            <template #p1>{{ h2h.p1[0].turned_pro.id }}</template>
                            <template #metric>Turned pro</template>
                            <template #p2>{{ h2h.p2[0].turned_pro.id }}</template>
                        </H2HItem>
                        <H2HItem :meter="func.percentage(func.percentage(h2h.p1[0].win, h2h.p1[0].win+h2h.p1[0].loss), func.percentage(h2h.p1[0].win, h2h.p1[0].win+h2h.p1[0].loss) + func.percentage(h2h.p2[0].win, h2h.p2[0].win + h2h.p2[0].loss))">
                            <template #p1>{{ h2h.p1[0].win }}/{{ h2h.p1[0].loss }}</template>
                            <template #metric>Career win/loss</template>
                            <template #p2>{{ h2h.p2[0].win }}/{{ h2h.p2[0].loss }}</template>
                        </H2HItem>
                        <H2HItem :meter="func.percentage(h2h.p1[0].titles, h2h.p1[0].titles+h2h.p2[0].titles)">
                            <template #p1>{{ h2h.p1[0].titles }}</template>
                            <template #metric>Career titles</template>
                            <template #p2>{{ h2h.p2[0].titles }}</template>
                        </H2HItem>
                        <H2HItem :meter="func.percentage(h2h.p1[0].pm_USD, h2h.p1[0].pm_USD+h2h.p2[0].pm_USD)">
                            <template #p1>{{ func.formatCurrency('USD', h2h.p1[0].pm_USD) }}</template>
                            <template #metric>Career prize money</template>
                            <template #p2>{{ func.formatCurrency('USD', h2h.p2[0].pm_USD) }}</template>
                        </H2HItem>
                        <H2HItem v-if="h2h.p1[0].career_high || h2h.p2[0].career_high" :meter="h2h.p1[0].career_high && h2h.p2[0].career_high ? func.percentage(h2h.p1[0].career_high, h2h.p1[0].career_high+h2h.p2[0].career_high) : h2h.p1[0].career_high ? func.percentage(h2h.p1[0].career_high, 0) : h2h.p2[0].career_high ? func.percentage(h2h.p2[0].career_high, 0) : func.percentage(0, 0)">
                            <template #p1>{{ h2h.p1[0].career_high ?? '-' }}</template>
                            <template #metric>Career high</template>
                            <template #p2>{{ h2h.p2[0].career_high ?? '-' }}</template>
                        </H2HItem>
                    </v-card>
                </v-col>
                <v-col
                    cols="4"
                >
                    <v-card
                        v-if="mdAndUp"
                        class="p-3 text-zinc-300 bg-green-800"
                        rounded="xl"
                    >
                        <PlayerStatItem>
                            <template #field>DOB</template>
                            <template #value>{{ h2h.p2[0].dob ? DateTime.fromISO(h2h.p2[0].dob).setLocale('gb').toFormat('dd LLLL yyyy') : 'Unknown' }}</template>
                        </PlayerStatItem>
                        <PlayerStatItem>
                            <template #field>Height</template>
                            <template #value>{{ h2h.p2[0].height_cm ? `${h2h.p2[0].height_cm} cm (${func.convertToFt(h2h.p2[0].height_cm)})` : 'Unknown' }}</template>
                        </PlayerStatItem>
                        <PlayerStatItem>
                            <template #field>Plays</template>
                            <template #value>{{ h2h.p2[0].rh !== null ? func.plays(h2h.p2[0].rh) : 'Unknown' }}</template>
                        </PlayerStatItem>
                        <PlayerStatItem>
                            <template #field>Backhand</template>
                            <template #value>{{ h2h.p2[0].bh1 !== null ? func.bh(h2h.p2[0].bh1) : 'Unknown' }}</template>
                        </PlayerStatItem>
                        <PlayerStatItem>
                            <template #field>Turned pro</template>
                            <template #value>{{ h2h.p2[0].turned_pro.id }}</template>
                        </PlayerStatItem>
                    </v-card>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-table
                        class="bg-transparent"
                    >
                        <thead
                            class="text-zinc-300"
                        >
                            <tr>
                                <th class="text-center !font-bold">Year</th>
                                <th class="text-center !font-bold">Winner</th>
                                <th class="text-center !font-bold">Event</th>
                                <th class="text-center !font-bold">Round</th>
                                <th class="text-center !font-bold">Surface</th>
                                <th class="text-center !font-bold">Score</th>
                            </tr>
                        </thead>
                        <tbody
                            v-if="h2h.matches.length===0"
                            class="text-zinc-300"
                        >
                            <tr>
                                <td
                                    colspan="6" class="text-center"
                                >
                                    No matches played
                                </td>
                            </tr>
                        </tbody>
                        <tbody
                            v-else
                            class="text-zinc-300"
                        >
                            <tr
                                v-for="match in h2h.matches"
                            >
                                <td
                                    class="text-center"
                                >
                                    <router-link
                                        class="hover-link"
                                        :to="{name: 'Event', params: {id: match.event.tournament.id, name: func.encodeName(match.event.tournament.name), year: match.event.year.id, eventId: match.event.id}}"
                                    >
                                        {{ match.event.year.id }}
                                    </router-link>
                                </td>
                                <td>
                                    <v-avatar
                                        class="mx-1"
                                        size="small"
                                    >
                                        <v-img
                                            v-if="match.winner.player"
                                            :src="func.headshot(match.winner.player.id)"
                                            :alt="match.winner.player.full_name"
                                        />
                                    </v-avatar>
                                    <router-link
                                        v-if="match.winner.player"
                                        class="hover-link mx-1"
                                        :to="{name: 'Player', params: {id: match.winner.player.id, name: func.encodeName(match.winner.player.full_name)}}"
                                    >
                                        {{ match.winner.player.full_name }}
                                    </router-link>
                                </td>
                                <td
                                    class="text-center"
                                >
                                    <router-link
                                        class="hover-link"
                                        :to="{name: 'Tournament', params: {name: func.encodeName(match.event.tournament.name), id: match.event.tournament.id}}"
                                    >
                                        {{ match.event.tournament.name }}
                                    </router-link>
                                </td>
                                <td
                                    class="text-center"
                                >
                                    {{ match.round }}
                                </td>
                                <td
                                    class="text-center"
                                >
                                    {{ match.event.surface.environment }} {{ match.event.surface.surface }}
                                </td>
                                <td
                                    class="text-center whitespace-nowrap"
                                >
                                    {{ match.winner.s1 }}{{ match.loser.s1 }}<sup v-if="match.winner.t1 && match.loser.t1">
                                        {{ func.getTieBreak(match.winner.t1, match.loser.t1) }}
                                    </sup>
                                    {{ match.winner.s2 }}{{ match.loser.s2 }}<sup v-if="match.winner.t2 && match.loser.t2">
                                        {{ func.getTieBreak(match.winner.t2, match.loser.t2) }}
                                    </sup>
                                    {{ match.winner.s3 }}{{ match.loser.s3 }}<sup v-if="match.winner.t3 && match.loser.t3">
                                        {{ func.getTieBreak(match.winner.t3, match.loser.t3) }}
                                    </sup>
                                    {{ match.winner.s4 }}{{ match.loser.s4 }}<sup v-if="match.winner.t4 && match.loser.t4">
                                        {{ func.getTieBreak(match.winner.t4, match.loser.t4) }}
                                    </sup>
                                    {{ match.winner.s5 }}{{ match.loser.s5 }}<sup v-if="match.winner.t5 && match.loser.t5">
                                        {{ func.getTieBreak(match.winner.t5, match.loser.t5) }}
                                    </sup>
                                </td>
                            </tr>
                        </tbody>
                    </v-table>
                </v-col>
            </v-row>
        </v-container>
        <div
            v-else
        >
            <div
                class="text-3xl"
            >
                {{ func.unencodeName(p1Name) }} v. {{ func.unencodeName(p2Name) }}
            </div>
            <div class="text-zinc-400 my-4">No data available</div>
        </div>
    </v-sheet>
</template>