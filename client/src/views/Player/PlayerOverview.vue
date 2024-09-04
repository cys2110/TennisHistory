<script setup lang="ts">
import { ref, watch, type Ref } from 'vue';
import apolloClient from '@/apollo';
import { getPlayer } from '@/services/PlayerService';
import { provideApolloClient, useQuery } from '@vue/apollo-composable';
import { DateTime } from 'luxon';
import type { PlayerDetails, MajorAgg, Major } from '@/utils/interfaces';
import { bh, plays, encodeName, convertToFt } from '@/utils/functions';
import Loading from '@/components/Loading.vue'
import OverviewDetail from '@/components/Player/OverviewDetail.vue'
import ResultsRow from '@/components/Player/ResultsRow.vue'

provideApolloClient(apolloClient)

const props = defineProps<{
    id: string,
    name: string
}>()

const { query, variables } = getPlayer(props.id)
const { result, loading, error } = useQuery(query, variables)

const player: Ref<PlayerDetails | null> = ref(null)
const results: Ref<{ name: string, id: number, round: MajorAgg, events: Major[] }[]> = ref([])

watch(result, (newResult) => {
    if (newResult) {
        player.value = newResult.players[0]
        results.value = [
            {
                name: "Australian Open",
                id: 580,
                round: newResult.players[0].aoAgg,
                events: newResult.players[0].ao
            },
            {
                name: 'Roland Garros',
                id: 520,
                round: newResult.players[0].rgAgg,
                events: newResult.players[0].rg
            },
            {
                name: 'Wimbledon',
                id: 540,
                round: newResult.players[0].wimbledonAgg,
                events: newResult.players[0].wimbledon
            },
            {
                name: 'US Open',
                id: 560,
                round: newResult.players[0].usoAgg,
                events: newResult.players[0].uso
            },
            {
                name: 'ATP Finals',
                id: 605,
                round: newResult.players[0].finalsAgg,
                events: newResult.players[0].finals
            },
            {
                name: 'Davis Cup',
                id: 8099,
                round: newResult.players[0].davisAgg,
                events: newResult.players[0].davis
            },
            {
                name: 'Olympics',
                id: 96,
                round: newResult.players[0].olympicsAgg,
                events: newResult.players[0].olympics
            },
            {
                name: 'Hopman Cup',
                id: 10003,
                round: newResult.players[0].hopmanAgg,
                events: newResult.players[0].hopman
            }
        ]
    }
}, { immediate: true })

watch(error, (newError) => {
    if (newError) console.error(newError)
}, { immediate: true })
</script>

<template>
    <v-container v-if="player">
        <v-row>
            <v-col class="sm:flex justify-between">
                <div class="w-100 mx-1 text-xs lg:text-sm">
                    <OverviewDetail>
                        <template #detailName>Active</template>
                        <template #detail>
                            <div v-if="player.retired" class="text-right">
                                <div>{{ player.retired.id - player.turned_pro.id }} years</div>
                                <div>{{ player.turned_pro.id }}-{{ player.retired.id }}</div>
                            </div>
                            <div v-else>
                                <div>{{ parseInt(DateTime.now().year) - player.turned_pro.id + 1 }} years</div>
                                <div>{{ player.turned_pro.id }} - present</div>
                            </div>
                        </template>
                    </OverviewDetail>
                    <OverviewDetail>
                        <template #detailName>Country</template>
                        <template #detail>{{ player.country.name }}</template>
                    </OverviewDetail>
                    <OverviewDetail>
                        <template #detailName>Height</template>
                        <template #detail>{{ player.height_cm ? `${player.height_cm}cm
                            (${convertToFt(player.height_cm)})` : '—' }}</template>
                    </OverviewDetail>
                    <OverviewDetail>
                        <template #detailName>Plays</template>
                        <template #detail>{{ player.rh !== null ? plays(player.rh) : '—' }}</template>
                    </OverviewDetail>
                </div>
                <div class="w-100 mx-1 text-xs lg:text-sm">
                    <OverviewDetail>
                        <template #detailName>Age</template>
                        <template #detail>
                            <div v-if="player.dob" class="text-right">
                                <div>{{
                                    Math.floor(Math.abs(DateTime.fromISO(player.dob).diffNow('years').toObject().years))
                                }}</div>
                                <div>({{ DateTime.fromISO(player.dob).setLocale('gb').toLocaleString(DateTime.DATE_FULL)
                                    }})
                                </div>
                            </div>
                            <div v-else>
                                —
                            </div>
                        </template>
                    </OverviewDetail>
                    <OverviewDetail>
                        <template #detailName>Backhand</template>
                        <template #detail>{{ player.bh1 !== null ? bh(player.bh1) : '—' }}</template>
                    </OverviewDetail>
                    <OverviewDetail>
                        <template #detailName>{{ player.coaches.length === 1 ? 'Coach' : 'Coaches' }}</template>
                        <template #detail>
                            <div v-if="player.coaches.length > 0" v-for="coach in player.coaches" :key="coach.id"
                                class="text-right">
                                <router-link v-if="coach.first_name" class="hover-link"
                                    :to="{ name: 'Player', params: { name: encodeName(coach.full_name), id: coach.id } }">
                                    {{ coach.full_name }}
                                </router-link>
                                <span v-else>
                                    {{ coach.id }}
                                </span>
                            </div>
                            <div v-else>
                                —
                            </div>
                        </template>
                    </OverviewDetail>
                </div>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-table class="bg-transparent rounded-lg" density="comfortable">
                    <thead>
                        <tr class="bg-indigo-800 text-zinc-300">
                            <th class="text-center !font-bold">
                                Tournament
                            </th>
                            <th class="text-center !font-bold">
                                Best Result
                            </th>
                            <th class="text-center !font-bold">
                                Year(s) achieved
                            </th>
                        </tr>
                    </thead>
                    <tbody class="text-zinc-300">
                        <ResultsRow v-for="result in results" :key="result.name" :tournamentName="result.name"
                            :tournamentId="result.id" :round="result.round" :events="result.events" />
                    </tbody>
                </v-table>
            </v-col>
        </v-row>
    </v-container>
    <Loading v-else class="mx-5" :loading>
        <template #None>No data available</template>
    </Loading>
</template>