<script setup lang="ts">
import { ref, watch, type Ref } from 'vue';
import apolloClient from '@/apollo';
import { getPlayer } from '@/services/PlayerService';
import { provideApolloClient, useQuery } from '@vue/apollo-composable';
import { DateTime } from 'luxon';
import type { PlayerDetails } from '@/utils/interfaces';
import { bh, plays, encodeName, convertToFt } from '@/utils/functions';

provideApolloClient(apolloClient)

const props = defineProps<{
    id: string,
    name: string
}>()

const { query, variables } = getPlayer(props.id)
const { result, loading, error } = useQuery(query, variables)

const player: Ref<PlayerDetails | null> = ref(null)

watch(result, (newResult) => {
    if (newResult) {
        player.value = newResult.players[0]
    }
}, {immediate: true})

watch(loading, (newLoad) => {
    if (newLoad) {
        console.log(newLoad)
    }
})

watch(error, (newError) => {
    if (newError) {
        console.error(newError)
    }
})
</script>

<template>
    <v-container
        v-if="player"
    >
        <v-row>
            <v-col
                class="sm:flex justify-between"
            >
                <div
                    class="w-100 mx-1 text-xs lg:text-sm"
                >
                    <div
                        class="my-2 bg-indigo-800 text-zinc-300 py-1 px-3 rounded-lg flex justify-between"
                    >
                        <div>Active</div>
                        <div>{{ player.turned_pro.id }} - {{ player.retired?.id ?? 'present' }}</div>
                    </div>
                    <div
                        class="my-2 bg-indigo-800 text-zinc-300 py-1 px-3 rounded-lg flex justify-between"
                    >
                        <div>Country</div>
                        <div>{{ player.country.name }}</div>
                    </div>
                    <div
                        class="my-2 bg-indigo-800 text-zinc-300 py-1 px-3 rounded-lg flex justify-between"
                    >
                        <div>Height</div>
                        <div>{{ player.height_cm ? `${player.height_cm}cm (${convertToFt(player.height_cm)})` : '—' }}</div>
                    </div>
                    <div
                        class="my-2 bg-indigo-800 text-zinc-300 py-1 px-3 rounded-lg flex justify-between"
                    >
                        <div>Plays</div>
                        <div>{{ player.rh !== null ? plays(player.rh) : '—' }}</div>
                    </div>
                </div>
                <div
                    class="w-100 mx-1 text-xs lg:text-sm"
                >
                    <div
                        class="my-2 bg-indigo-800 text-zinc-300 py-1 px-3 rounded-lg flex justify-between"
                    >
                        <div>Age</div>
                        <div
                            v-if="player.dob"
                            class="text-right"
                        >
                            <div>{{ Math.floor(Math.abs(DateTime.fromISO(player.dob).diffNow('years').toObject().years)) }}</div>
                            <div>({{ DateTime.fromISO(player.dob).setLocale('gb').toLocaleString(DateTime.DATE_FULL) }})</div>
                        </div>
                        <div
                            v-else
                        >
                            —
                        </div>
                    </div>
                    <div
                        class="my-2 bg-indigo-800 text-zinc-300 py-1 px-3 rounded-lg flex justify-between"
                    >
                        <div>Backhand</div>
                        <div>{{ player.bh1 !== null ? bh(player.bh1) : '—' }}</div>
                    </div>
                    <div
                        class="my-2 bg-indigo-800 text-zinc-300 py-1 px-3 rounded-lg flex justify-between"
                    >
                        <div
                            class="flex items-center"
                        >
                            {{ player.coaches.length === 1 ? 'Coach' : 'Coaches' }}
                        </div>
                        <div>
                            <div
                                v-if="player.coaches.length > 0"
                                v-for="coach in player.coaches"
                                :key="coach.id"
                                class="text-right"
                            >
                                <router-link
                                    v-if="coach.first_name"
                                    class="hover-link"
                                    :to="{name: 'Player', params: {name: encodeName(coach.full_name), id: coach.id}}"
                                >
                                    {{ coach.full_name }}
                                </router-link>
                                <span
                                    v-else
                                >
                                    {{ coach.id }}
                                </span>
                            </div>
                            <div
                                v-else
                            >
                                —
                            </div>
                        </div>
                    </div>
                </div>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-table
                    class="bg-transparent rounded-lg"
                    density="comfortable"
                >
                    <thead>
                        <tr
                            class="bg-indigo-800 text-zinc-300"
                        >
                            <th
                                class="text-center !font-bold"
                            >
                                Tournament
                            </th>
                            <th
                                class="text-center !font-bold"
                            >
                                Best Result
                            </th>
                            <th
                                class="text-center !font-bold"
                            >
                                Year(s) achieved
                            </th>
                        </tr>
                    </thead>
                    <tbody
                        class="text-zinc-300"
                    >
                        <tr
                            style="height: 0;"
                        >
                            <td
                                class="text-center"
                            >
                                <router-link
                                    class="hover-link"
                                    :to="{name: 'Tournament', params: {name: 'Australian_Open', id: 580}}"
                                >
                                    Australian Open
                                </router-link>
                            </td>
                            <td
                                class="text-center"
                            >
                                <span
                                    v-if="player.aoAgg.node.round.longest"
                                >
                                    {{ player.aoAgg.node.round.longest }} ({{ player.aoAgg.count }})
                                </span>
                                <span
                                    v-else
                                >
                                    —
                                </span>
                            </td>
                            <td>
                                <div
                                    v-if="player.ao.length > 0"
                                    class="d-flex flex-col py-1"
                                >
                                    <router-link
                                        v-for="(round, index) in player.ao"
                                        :key="round.event.id"
                                        class="hover-link"
                                        :to="{name: 'Event', params: {name: 'Australian_Open', id: 580, year: round.event.year.id, eventId: round.event.id}}"
                                    >
                                        {{ round.event.year.id }}
                                    </router-link>
                                </div>
                                <div
                                    v-else
                                >
                                    —
                                </div>
                            </td>
                        </tr>
                        <tr
                            style="height: 0;"
                        >
                            <td
                                class="text-center"
                            >
                                <router-link
                                    class="hover-link"
                                    :to="{name: 'Tournament', params: {name: 'Roland_Garros', id: 520}}"
                                >
                                    Roland Garros
                                </router-link>
                            </td>
                            <td
                                class="text-center"
                            >
                                <span
                                    v-if="player.rgAgg.node.round.longest"
                                >
                                    {{ player.rgAgg.node.round.longest }} ({{ player.rgAgg.count }})
                                </span>
                                <span
                                    v-else
                                >
                                    —
                                </span>
                            </td>
                            <td>
                                <div
                                    v-if="player.rg.length > 0"
                                    class="d-flex flex-col py-1"
                                >
                                    <router-link
                                        v-for="round in player.rg"
                                        :key="round.event.id"
                                        class="hover-link"
                                        :to="{name: 'Event', params: {name: 'Roland_Garros', id: 520, year: round.event.year.id, eventId: round.event.id}}"
                                    >
                                        {{ round.event.year.id }}
                                    </router-link>
                                </div>
                                <div
                                    v-else
                                >
                                    —
                                </div>
                            </td>
                        </tr>
                        <tr
                            style="height: 0;"
                        >
                            <td
                                class="text-center"
                            >
                                <router-link
                                    class="hover-link"
                                    :to="{name: 'Tournament', params: {name: 'Wimbledon', id: 540}}"
                                >
                                    Wimbledon
                                </router-link>
                            </td>
                            <td
                                class="text-center"
                            >
                                <span
                                    v-if="player.wimbledonAgg.node.round.longest"
                                >
                                    {{ player.wimbledonAgg.node.round.longest }} ({{ player.wimbledonAgg.count }})
                                </span>
                                <span
                                    v-else
                                >
                                    —
                                </span>
                            </td>
                            <td>
                                <div
                                    v-if="player.wimbledon.length > 0"
                                    class="d-flex flex-col py-1"
                                >
                                    <router-link
                                        v-for="round in player.wimbledon"
                                        :key="round.event.id"
                                        class="hover-link"
                                        :to="{name: 'Event', params: {name: 'Wimbledon', id: 540, year: round.event.year.id, eventId: round.event.id}}"
                                    >
                                        {{ round.event.year.id }}
                                    </router-link>
                                </div>
                                <div
                                    v-else
                                >
                                    —
                                </div>
                            </td>
                        </tr>
                        <tr
                            style="height: 0;"
                        >
                            <td
                                class="text-center"
                            >
                                <router-link
                                    class="hover-link"
                                    :to="{name: 'Tournament', params: {name: 'US_Open', id: 560}}"
                                >
                                    US Open
                                </router-link>
                            </td>
                            <td
                                class="text-center"
                            >
                                <span
                                    v-if="player.usoAgg.node.round.longest"
                                >
                                    {{ player.usoAgg.node.round.longest }} ({{ player.usoAgg.count }})
                                </span>
                                <span
                                    v-else
                                >
                                    —
                                </span>
                            </td>
                            <td>
                                <div
                                    v-if="player.uso.length > 0"
                                    class="d-flex flex-col py-1"
                                >
                                    <router-link
                                        v-for="round in player.uso"
                                        :key="round.event.id"
                                        class="hover-link"
                                        :to="{name: 'Event', params: {name: 'USO_Open', id: 560, year: round.event.year.id, eventId: round.event.id}}"
                                    >
                                        {{ round.event.year.id }}
                                    </router-link>
                                </div>
                                <div
                                    v-else
                                >
                                    —
                                </div>
                            </td>
                        </tr>
                        <tr
                            style="height: 0;"
                        >
                            <td
                                class="text-center"
                            >
                                <router-link
                                    class="hover-link"
                                    :to="{name: 'Tournament', params: {name: 'ATP_Finals', id: 605}}"
                                >
                                    ATP Finals
                                </router-link>
                            </td>
                            <td
                                class="text-center"
                            >
                                <span
                                    v-if="player.finalsAgg.node.round.longest"
                                >
                                    {{ player.finalsAgg.node.round.longest }} ({{ player.finalsAgg.count }})
                                </span>
                                <span
                                    v-else
                                >
                                    —
                                </span>
                            </td>
                            <td>
                                <div
                                    v-if="player.finals.length > 0"
                                    class="d-flex flex-col py-1"
                                >
                                    <router-link
                                        v-for="round in player.finals"
                                        :key="round.event.id"
                                        class="hover-link"
                                        :to="{name: 'Event', params: {name: 'ATP_Finals', id: 605, year: round.event.year.id, eventId: round.event.id}}"
                                    >
                                        {{ round.event.year.id }}
                                    </router-link>
                                </div>
                                <div
                                    v-else
                                >
                                    —
                                </div>
                            </td>
                        </tr>
                        <tr
                            style="height: 0;"
                        >
                            <td
                                class="text-center"
                            >
                                <router-link
                                    class="hover-link"
                                    :to="{name: 'Tournament', params: {name: 'Davis_Cup', id: 8099}}"
                                >
                                    Davis Cup
                                </router-link>
                            </td>
                            <td
                                class="text-center"
                            >
                                <span
                                    v-if="player.davisAgg.node.round.longest"
                                >
                                    {{ player.davisAgg.node.round.longest }} ({{ player.davisAgg.count }})
                                </span>
                                <span
                                    v-else
                                >
                                    —
                                </span>
                            </td>
                            <td>
                                <div
                                    v-if="player.davis.length > 0"
                                    class="d-flex flex-col py-1"
                                >
                                    <router-link
                                        v-for="round in player.davis"
                                        :key="round.event.id"
                                        class="hover-link"
                                        :to="{name: 'Event', params: {name: 'Davis Cup', id: 8099, year: round.event.year.id, eventId: round.event.id}}"
                                    >
                                        {{ round.event.year.id }}
                                    </router-link>
                                </div>
                                <div
                                    v-else
                                >
                                    —
                                </div>
                            </td>
                        </tr>
                        <tr
                            style="height: 0;"
                        >
                            <td
                                class="text-center"
                            >
                                <router-link
                                    class="hover-link"
                                    :to="{name: 'Tournament', params: {name: 'Olympics', id: 96}}"
                                >
                                    Olympics
                                </router-link>
                            </td>
                            <td
                                class="text-center"
                            >
                                <span
                                    v-if="player.olympicsAgg.node.round.longest"
                                >
                                    {{ player.olympicsAgg.node.round.longest }} ({{ player.olympicsAgg.count }})
                                </span>
                                <span
                                    v-else
                                >
                                    —
                                </span>
                            </td>
                            <td>
                                <div
                                    v-if="player.olympics.length > 0"
                                    class="d-flex flex-col py-1"
                                >
                                    <router-link
                                        v-for="round in player.olympics"
                                        :key="round.event.id"
                                        class="hover-link"
                                        :to="{name: 'Event', params: {name: 'Olympics', id: 96, year: round.event.year.id, eventId: round.event.id}}"
                                    >
                                        {{ round.event.year.id }}
                                    </router-link>
                                </div>
                                <div
                                    v-else
                                >
                                    —
                                </div>
                            </td>
                        </tr>
                        <tr
                            style="height: 0;"
                        >
                            <td
                                class="text-center"
                            >
                                <router-link
                                    class="hover-link"
                                    :to="{name: 'Tournament', params: {name: 'Hopman_Cup', id: 10003}}"
                                >
                                    Hopman Cup
                                </router-link>
                            </td>
                            <td
                                class="text-center"
                            >
                                <span
                                    v-if="player.hopmanAgg.node.round.longest"
                                >
                                    {{ player.hopmanAgg.node.round.longest }} ({{ player.hopmanAgg.count }})
                                </span>
                                <span
                                    v-else
                                >
                                    —
                                </span>
                            </td>
                            <td>
                                <div
                                    v-if="player.hopman.length > 0"
                                    class="d-flex flex-col py-1"
                                >
                                    <router-link
                                        v-for="round in player.hopman"
                                        :key="round.event.id"
                                        class="hover-link"
                                        :to="{name: 'Event', params: {name: 'Hopman Cup', id: 10003, year: round.event.year.id, eventId: round.event.id}}"
                                    >
                                        {{ round.event.year.id }}
                                    </router-link>
                                </div>
                                <div
                                    v-else
                                >
                                    —
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </v-table>
            </v-col>
        </v-row>
    </v-container>
</template>