<script setup lang="ts">
import { ref, watch, type Ref } from 'vue';
import apolloClient from '@/apollo';
import { provideApolloClient, useQuery } from '@vue/apollo-composable';
import { getEventDetails } from '@/services/EventService';
import type { EventDetails } from '@/utils/interfaces';
import { formatCurrency } from '@/utils/functions';
import OverviewDetail from '@/components/Global/OverviewDetail.vue';
import Seeds from '@/components/Event/Seeds.vue';
import PMTable from '@/components/Event/PMTable.vue';
import EntryTable from '@/components/Event/EntryTable.vue';
import EntryRow from '@/components/Event/EntryRow.vue';
import Loading from '@/components/Global/Loading.vue';

provideApolloClient(apolloClient)

const props = defineProps<{
    eventId: string
}>()

const { query, variables } = getEventDetails(parseInt(props.eventId))
const { result, loading, error } = useQuery(query, variables)

const event: Ref<EventDetails | null> = ref(null)
const pm: Ref<{ round: string, pm: number, pts: number }[]> = ref([])

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
}, { immediate: true })

watch(error, (newError) => {
    if (newError) console.error(newError)
})
</script>

<template>
    <v-container v-if="event">
        <v-row>
            <v-col class="sm:flex justify-between">
                <div class="w-100 mx-1 text-xs lg:text-sm">
                    <OverviewDetail>
                        <template #detailName>Venue</template>
                        <template #detail>
                            <div>{{ event.venue?.name ?? '—' }}</div>
                            <div>{{ event.venue?.city }}, {{ event.venue?.country.name }}</div>
                        </template>
                    </OverviewDetail>
                    <OverviewDetail>
                        <template #detailName>Surface</template>
                        <template #detail>
                            <div>{{ event.surface?.environment }} {{ event.surface?.surface }}</div>
                            <div v-if="event.surface?.hard_type">({{ event.surface.hard_type }})</div>
                        </template>
                    </OverviewDetail>
                </div>
                <div class="w-100 mx-1 text-xs lg:text-sm">
                    <OverviewDetail>
                        <template #detailName>Prize money</template>
                        <template #detail>{{ event.currency && event.pm ? formatCurrency(event.currency, event.pm) : '—'
                            }}</template>
                    </OverviewDetail>
                    <OverviewDetail>
                        <template #detailName>Total financial commitment</template>
                        <template #detail>{{ event.currency && event.tfc ? formatCurrency(event.currency, event.tfc) :
                            '—' }}</template>
                    </OverviewDetail>
                    <OverviewDetail>
                        <template #detailName>{{ event.supervisors?.length === 1 ? 'Supervisor' : 'Supervisors'
                            }}</template>
                        <template #detail>
                            <div v-if="event.supervisors && event.supervisors.length > 0"
                                v-for="supervisor in event.supervisors" :key="supervisor.id" class="text-right">{{
                                    supervisor.id }}</div>
                            <div v-else>—</div>
                        </template>
                    </OverviewDetail>
                </div>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <Seeds v-if="event.seeds && event.seeds.edges.length > 0" :seeds="event.seeds.edges" />
            </v-col>
            <v-col>
                <PMTable v-if="event.winner_pm" :pm :currency="event.currency ?? 'USD'" />
                <EntryTable v-if="event.lda && event.lda.edges.length > 0" heading="Last direct acceptance">
                    <template #row>
                        <EntryRow v-for="player in event.lda.edges" :key="player.node.id" :player>
                            <template #reason>
                                {{ player.properties.status === 'PR' ? 'P' : '' }} {{ player.properties.lda === 0 ? '' :
                                    player.properties.lda }}
                            </template>
                        </EntryRow>
                    </template>
                </EntryTable>
                <EntryTable v-if="event.ll && event.ll.edges.length > 0" heading="Lucky losers">
                    <template #row>
                        <EntryRow v-for="player in event.ll.edges" :key="player.node.id" :player />
                    </template>
                </EntryTable>
                <EntryTable v-if="event.alt && event.alt.edges.length > 0" heading="Alternates">
                    <template #row>
                        <EntryRow v-for="player in event.alt.edges" :key="player.node.id" :player />
                    </template>
                </EntryTable>
                <EntryTable v-if="event.wd && event.wd.edges.length > 0" heading="Withdrawals">
                    <template #row>
                        <EntryRow v-for="player in event.wd.edges" :key="player.node.id" :player>
                            <template #reason>
                                {{ player.properties.wd !== 'true' ? player.properties.wd : '' }}
                            </template>
                        </EntryRow>
                    </template>
                </EntryTable>
                <EntryTable v-if="event.ret && event.ret.edges.length > 0" heading="Retirements">
                    <template #row>
                        <EntryRow v-for="player in event.ret.edges" :key="player.node.id" :player>
                            <template #reason>
                                {{ player.properties.ret !== 'true' ? player.properties.ret : '' }}
                            </template>
                        </EntryRow>
                    </template>
                </EntryTable>
                <EntryTable v-if="event.wo && event.wo.edges.length > 0" heading="Walkovers">
                    <template #row>
                        <EntryRow v-for="player in event.wo.edges" :key="player.node.id" :player>
                            <template #reason>
                                {{ player.properties.wo !== 'true' ? player.properties.wo : '' }}
                            </template>
                        </EntryRow>
                    </template>
                </EntryTable>
                <EntryTable v-if="event.defaulted && event.defaulted.edges.length > 0" heading="Defaults">
                    <template #row>
                        <EntryRow v-for="player in event.defaulted.edges" :key="player.node.id" :player>
                            <template #reason>
                                {{ player.properties.defaulted !== 'true' ? player.properties.defaulted : '' }}
                            </template>
                        </EntryRow>
                    </template>
                </EntryTable>
            </v-col>
        </v-row>
    </v-container>
    <Loading v-else :loading>
        <template #None>No data available</template>
    </Loading>
</template>