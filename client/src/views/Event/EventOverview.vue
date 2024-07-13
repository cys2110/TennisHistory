<script setup lang="ts">
import { ref, watch, type Ref } from 'vue';
import apolloClient from '@/apollo';
import { provideApolloClient, useQuery } from '@vue/apollo-composable';
import { getEventDetails } from '@/services/EventService';
import type { EventDetails } from '@/utils/interfaces';
import { formatCurrency } from '@/utils/functions';

provideApolloClient(apolloClient)

const props = defineProps<{
    eventId: string
}>()

const { query, variables } = getEventDetails(parseInt(props.eventId))
const { result, loading, error} = useQuery(query, variables)

const event: Ref<EventDetails | null> = ref(null)
const pm: Ref<{round: string, pm: number, pts: number}[]> = ref([])

watch(result, (newResult) => {
    if (newResult) {
        event.value = newResult.events[0]
        pm.value = [
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
    <v-container
        v-if="event"
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
                        <div>Venue</div>
                        <div>{{ event.venue.name ?? '—' }}</div>
                    </div>
                    <div
                        class="my-2 bg-indigo-800 text-zinc-300 py-1 px-3 rounded-lg flex justify-between"
                    >
                        <div>City</div>
                        <div>{{ event.venue.city }}, {{ event.venue.country.name }}</div>
                    </div>
                    <div
                        class="my-2 bg-indigo-800 text-zinc-300 py-1 px-3 rounded-lg flex justify-between"
                    >
                        <div>Surface</div>
                        <div>
                            {{ event.surface.environment }} {{ event.surface.surface }}
                            <div
                                v-if="event.surface.hard_type"
                            >
                                ({{ event.surface.hard_type }})
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    class="w-100 mx-1 text-xs lg:text-sm"
                >
                    <div
                        class="my-2 bg-indigo-800 text-zinc-300 py-1 px-3 rounded-lg flex justify-between"
                    >
                        <div>Prize money</div>
                        <div>{{ event.pm ? formatCurrency(event.currency, event.pm) : '—' }}</div>
                    </div>
                    <div
                        class="my-2 bg-indigo-800 text-zinc-300 py-1 px-3 rounded-lg flex justify-between"
                    >
                        <div>Total financial commitment</div>
                        <div>{{ event.tfc ? formatCurrency(event.currency, event.tfc) : '—' }}</div>
                    </div>
                    <div
                        class="my-2 bg-indigo-800 text-zinc-300 py-1 px-3 rounded-lg flex justify-between"
                    >
                        <div
                            class="flex items-center"
                        >
                            {{ event.supervisors?.length === 1 ? 'Supervisor' : 'Supervisors' }}
                        </div>
                        <div>
                            <div
                                v-if="event.supervisors.length > 0"
                                v-for="supervisor in event.supervisors"
                                :key="supervisor.id"
                                class="text-right"
                            >
                                {{ supervisor.id }}
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
                    v-if="event.winner_pm"
                    class="bg-transparent rounded-xl mb-3"
                    fixed-header
                    hover
                >
                    <thead
                        class="text-xs text-zinc-300"
                    >
                        <tr>
                            <th
                                class="!bg-indigo-800"
                            />
                            <th
                                class="!font-bold text-center !bg-indigo-800"
                            >
                                Prize money
                            </th>
                            <th
                                class="!font-bold text-center !bg-indigo-800"
                            >
                                Points
                            </th>
                        </tr>
                    </thead>
                    <tbody
                        class="text-xs text-zinc-300"
                    >
                        <tr
                            v-for="row in pm"
                            :key="row.round"
                        >
                            <td
                                v-if="row.pm || row.pts"
                            >
                                {{ row.round }}
                            </td>
                            <td
                                v-if="row.pm || row.pts"
                                class="text-center"
                            >
                                {{ row.pm ? formatCurrency(event.currency, row.pm) : '—' }}
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
            </v-col>
        </v-row>
    </v-container>
</template>