<script setup lang="ts">
import { onMounted, ref, watch, type Ref } from 'vue';
import { useDisplay } from 'vuetify';
import { DateTime } from 'luxon'
import H2HService from '@/services/H2HService';
import PlayerService from '@/services/PlayerService';
import PlayerStatItem from '@/components/H2H/PlayerStatItem.vue';
import H2HItem from '@/components/H2H/H2HItem.vue';
import ScoreItem from '@/components/H2H/ScoreItem.vue';
import * as functions from '@/components/utils';
import type { PlayerDetails, MatchH2H } from '@/components/interfaces';

const props = defineProps<{
    p1Id: string,
    p2Id: string,
    p1Name: string,
    p2Name: string
}>()
const { mdAndUp, smAndUp } = useDisplay()

const p1: Ref<PlayerDetails | null> = ref(null)
const p2: Ref<PlayerDetails | null> = ref(null)
const matches: Ref<MatchH2H[]> = ref([])
const p1Wins: Ref<number> = ref(0)
const p2Wins: Ref<number> = ref(0)
const totalMatches: Ref<number> = ref(0)

const searchH2H = () => {
    PlayerService.getPlayerById(props.p1Id)
    .then(response => p1.value = response.data)
    .catch(e => console.log(e))

    PlayerService.getPlayerById(props.p2Id)
    .then(response => p2.value = response.data)
    .catch(e => console.log(e))

    H2HService.h2h(props.p1Id, props.p2Id)
    .then(response => {
        matches.value = response.data.matches
        p1Wins.value = response.data.count.p1Wins
        p2Wins.value = response.data.count.p2Wins
        totalMatches.value = response.data.count.total
    })
    .catch(e => console.log(e))
}

const updateDocumentTitle = () => {
    const nameP1 = props.p1Name.replace(/_/g, ' ')
    const nameP2 = props.p2Name.replace(/_/g, ' ')
    document.title = `${nameP1} v. ${nameP2} | TennisHistory`
}

onMounted(() => searchH2H())

watch(() => [props.p1Name, props.p2Name], () => {
    updateDocumentTitle()
}, {immediate: true})
</script>

<template>
    <v-sheet class="w-5/6 md:w-8/12 lg:w-1/2 mx-auto my-10 bg-transparent">
        <v-container v-if="p1 && p2">
            <v-row>
                <v-col class="flex-col items-center" cols="4">
                    <div>
                        <v-img
                            :src="functions.headshot(p1.id)"
                            :alt="p1.full_name"
                            rounded="circle"
                            class="border-2 border-zinc-300 my-3 sm:w-5/6 md:w-2/3 mx-auto"
                        />
                    </div>
                    <div class="sm:!flex sm:!justify-center">
                        <div>
                            <flag-img
                                :src="functions.flagSrc(p1.country)"
                                :alt="p1.country"
                                class="w-[2rem] mx-auto my-1"
                            />
                        </div>
                        <div class="text-center text-lg sm:mx-1">
                            <router-link
                                class="hover-link"
                                :to="{name: 'Player', params: {id: p1.id, name: functions.encodeName(p1.full_name)}}"
                            >
                                {{ p1.full_name }}
                            </router-link>
                        </div>
                    </div>
                </v-col>
                <v-col cols="4" class="flex items-center justify-center">
                    <div class="text-xl">{{ (+p1Wins) + (+p2Wins) }}</div>
                    <div class="mx-3">
                        <v-progress-circular
                            :size="mdAndUp ? 200 : smAndUp ? 100 : 50"
                            color="#3730a3"
                            bg-color="#166534"
                            :model-value="functions.percentage((+p1Wins) + (+p2Wins), +totalMatches)"
                        />
                    </div>
                    <div class="text-lg">{{ (+totalMatches) - ((+p1Wins) + (+p2Wins)) }}</div>
                </v-col>
                <v-col class="flex-col items-center" cols="4">
                    <div>
                        <v-img
                            :src="functions.headshot(p2.id)"
                            :alt="p2.full_name"
                            rounded="circle"
                            class="border-2 border-zinc-300 my-3 sm:w-5/6 md:w-2/3 mx-auto"
                        />
                    </div>
                    <div class="sm:flex sm:justify-center">
                        <div>
                            <flag-img
                                :src="functions.flagSrc(p2.country)"
                                :alt="p2.country"
                                class="w-[2rem] mx-auto my-1"
                            />
                        </div>
                        <div class="text-lg text-center sm:mx-1">
                            <router-link
                                class="hover-link"
                                :to="{name: 'Player', params: {id: p2.id, name: functions.encodeName(p2.full_name)}}"
                            >
                                {{ p2.full_name }}
                            </router-link>
                        </div>
                    </div>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="4">
                    <short-card v-if="mdAndUp" class="p-3 text-zinc-300">
                        <PlayerStatItem>
                            <template #field>DOB</template>
                            <template #value>{{ p1.dob ? DateTime.fromISO(p1.dob).setLocale('gb').toFormat('dd LLLL yyyy') : 'Unknown' }}</template>
                        </PlayerStatItem>
                        <PlayerStatItem>
                            <template #field>Height</template>
                            <template #value>{{ p1.height_cm ? `${p1.height_cm} cm (${p1.height_ft})` : 'Unknown' }}</template>
                        </PlayerStatItem>
                        <PlayerStatItem>
                            <template #field>Plays</template>
                            <template #value>{{ p1.rh !== null ? functions.plays(p1.rh) : 'Unknown' }}</template>
                        </PlayerStatItem>
                        <PlayerStatItem>
                            <template #field>Backhand</template>
                            <template #value>{{ p1.bh1 !== null ? functions.bh(p1.bh1) : 'Unknown' }}</template>
                        </PlayerStatItem>
                        <PlayerStatItem>
                            <template #field>Turned pro</template>
                            <template #value>{{ p1.turned_pro }}</template>
                        </PlayerStatItem>
                    </short-card>
                </v-col>
                <v-col cols="12" md="4">
                    <v-card
                        variant="text"
                    >
                        <H2HItem v-if="!mdAndUp">
                            <template #p1>{{ p1.dob ? DateTime.fromISO(p1.dob).setLocale('gb').toLocaleString(DateTime.DATE_FULL) : 'Unknown' }}</template>
                            <template #metric>DOB</template>
                            <template #p2>{{ p2.dob ? DateTime.fromISO(p2.dob).setLocale('gb').toLocaleString(DateTime.DATE_FULL) : 'Unknown' }}</template>
                        </H2HItem>
                        <H2HItem v-if="!mdAndUp">
                            <template #p1>{{ p1.height_cm ? `${p1.height_cm} cm (${p1.height_ft})` : 'Unknown' }}</template>
                            <template #metric>Height</template>
                            <template #p2>{{ p2.height_cm ? `${p2.height_cm} cm (${p2.height_ft})` : 'Unknown' }}</template>
                        </H2HItem>
                        <H2HItem v-if="!mdAndUp">
                            <template #p1>{{ p1.rh !== null ? functions.plays(p1.rh) : 'Unknown' }}</template>
                            <template #metric>Plays</template>
                            <template #p2>{{ p2.rh !== null ? functions.plays(p2.rh) : 'Unknown' }}</template>
                        </H2HItem>
                        <H2HItem v-if="!mdAndUp">
                            <template #p1>{{ p1.bh1 !== null ? functions.bh(p1.bh1) : 'Unknown' }}</template>
                            <template #metric>Backhand</template>
                            <template #p2>{{ p2.bh1 !== null ? functions.bh(p2.bh1) : 'Unknown' }}</template>
                        </H2HItem>
                        <H2HItem v-if="!mdAndUp">
                            <template #p1>{{ p1.turned_pro }}</template>
                            <template #metric>Turned pro</template>
                            <template #p2>{{ p2.turned_pro }}</template>
                        </H2HItem>
                        <H2HItem :meter="functions.percentage(functions.percentage(p1.win, p1.win+p1.loss), functions.percentage(p1.win, p1.win+p1.loss) + functions.percentage(p2.win, p2.win + p2.loss))">
                            <template #p1>{{ p1.win }}/{{ p1.loss }}</template>
                            <template #metric>Career win/loss</template>
                            <template #p2>{{ p2.win }}/{{ p2.loss }}</template>
                        </H2HItem>
                        <H2HItem :meter="functions.percentage(p1.titles, p1.titles+p2.titles)">
                            <template #p1>{{ p1.titles }}</template>
                            <template #metric>Career titles</template>
                            <template #p2>{{ p2.titles }}</template>
                        </H2HItem>
                        <H2HItem :meter="functions.percentage(p1.pm_USD, p1.pm_USD+p2.pm_USD)">
                            <template #p1>{{ functions.formatCurrency('USD', p1.pm_USD) }}</template>
                            <template #metric>Career prize money</template>
                            <template #p2>{{ functions.formatCurrency('USD', p2.pm_USD) }}</template>
                        </H2HItem>
                        <H2HItem v-if="p1.career_high || p2.career_high" :meter="p1.career_high && p2.career_high ? functions.percentage(p1.career_high, p1.career_high+p2.career_high) : p1.career_high ? functions.percentage(p1.career_high, 0) : p2.career_high ? functions.percentage(p2.career_high, 0) : functions.percentage(0, 0)">
                            <template #p1>{{ p1.career_high ?? '-' }}</template>
                            <template #metric>Career high</template>
                            <template #p2>{{ p2.career_high ?? '-' }}</template>
                        </H2HItem>
                    </v-card>
                </v-col>
                <v-col>
                    <short-card v-if="mdAndUp" cols="4" class="p-3 !text-zinc-300 !bg-green-800">
                        <PlayerStatItem>
                            <template #field>DOB</template>
                            <template #value>{{ p2.dob ? DateTime.fromISO(p2.dob).setLocale('gb').toFormat('dd LLLL yyyy') : 'Unknown' }}</template>
                        </PlayerStatItem>
                        <PlayerStatItem>
                            <template #field>Height</template>
                            <template #value>{{ p2.height_cm ? `${p2.height_cm} cm (${p2.height_ft})` : 'Unknown' }}</template>
                        </PlayerStatItem>
                        <PlayerStatItem>
                            <template #field>Plays</template>
                            <template #value>{{ p2.rh !== null ? functions.plays(p2.rh) : 'Unknown' }}</template>
                        </PlayerStatItem>
                        <PlayerStatItem>
                            <template #field>Backhand</template>
                            <template #value>{{ p2.bh1 !== null ? functions.bh(p2.bh1) : 'Unknown' }}</template>
                        </PlayerStatItem>
                        <PlayerStatItem>
                            <template #field>Turned pro</template>
                            <template #value>{{ p2.turned_pro }}</template>
                        </PlayerStatItem>
                    </short-card>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-table class="bg-transparent">
                        <thead class="text-zinc-300">
                            <tr>
                                <th class="text-center text-base">Year</th>
                                <th class="text-base">Winner</th>
                                <th class="text-center text-base">Event</th>
                                <th class="text-center text-base">Round</th>
                                <th class="text-center text-base">Surface</th>
                                <th class="text-center text-base">Score</th>
                            </tr>
                        </thead>
                        <tbody
                            v-if="matches.length===0"
                            class="text-zinc-300"
                        >
                            <tr>
                                <td colspan="6" class="text-center">No matches played</td>
                            </tr>
                        </tbody>
                        <tbody
                            v-else
                            class="text-zinc-300"
                        >
                            <tr v-for="match in matches">
                                <td class="text-center">
                                    <router-link
                                        class="hover-link"
                                        :to="{name: 'Edition', params: {name: functions.encodeName(match.Edition.Tournament.name), id: match.Edition.Tournament.id, editionNo: match.Edition.edition_no}}"
                                    >
                                        {{ match.Edition.year }}
                                    </router-link>
                                </td>
                                <td class="flex items-center">
                                    <div class="mx-1 w-[2rem]">
                                        <flag-img
                                            :src="match.winner_id === p1.id ? functions.flagSrc(p1.country) : functions.flagSrc(p2.country)"
                                            :alt="match.winner_id === p1.id ? p1.country : p2.country"
                                        />
                                    </div>
                                    <div class="mx-1">
                                        <v-avatar size="small">
                                            <v-img
                                                :src="match.winner_id === p1.id ? functions.headshot(p1.id) : functions.headshot(p2.id)"
                                                :alt="match.winner_id === p1.id ? p1.full_name : p2.full_name"
                                            />
                                        </v-avatar>
                                    </div>
                                    <div class="mx-1">
                                        <router-link
                                            v-if="match.winner_id === p1.id"
                                            class="hover-link"
                                            :to="{name: 'Player', params: {id: p1.id, name: functions.encodeName(p1.full_name)}}"
                                        >
                                            {{ p1.full_name }}
                                        </router-link>
                                        <router-link
                                            v-else
                                            class="hover-link"
                                            :to="{name: 'Player', params: {id: p2.id, name: functions.encodeName(p2.full_name)}}"
                                        >
                                            {{ p2.full_name }}
                                        </router-link>
                                    </div>
                                </td>
                                <td class="text-center">
                                    <router-link
                                        class="hover-link"
                                        :to="{name: 'Tournament', params: {name: functions.encodeName(match.Edition.Tournament.name), id: match.Edition.Tournament.id}}"
                                    >
                                        {{ match.Edition.Tournament.name }}
                                    </router-link>
                                </td>
                                <td class="text-center">{{ functions.round(match.round) }}</td>
                                <td class="text-center">{{ match.Edition.environment }} {{ match.Edition.surface }}</td>
                                <td class="text-center whitespace-nowrap">
                                    <div class="flex justify-center">
                                        <ScoreItem :match :p1="p1Id"/>
                                        <span v-if="match.incomplete">{{ functions.incomplete(match.incomplete) }}</span>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </v-table>
                </v-col>
            </v-row>
        </v-container>
        <div v-else>
            <div class="text-3xl text-zinc-300">{{ p1Name.replace(/_/g, ' ') }} v. {{ p2Name.replace(/_/g, ' ') }}</div>
            <div class="text-zinc-400 my-4">No data available.</div>
        </div>
    </v-sheet>
</template>