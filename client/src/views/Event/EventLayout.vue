<script setup lang="ts">
import { ref, type Ref, watch } from 'vue';
import apolloClient from '@/apollo';
import { provideApolloClient, useQuery } from '@vue/apollo-composable';
import { getEvent } from '@/services/EventService';
import type { Event } from '@/utils/interfaces';
import { unencodeName, category, formattedDates } from '@/utils/functions';

provideApolloClient(apolloClient)

const props = defineProps<{
    id: string,
    name: string,
    eventId: string
}>()

const event: Ref<Event | null> = ref(null)
const tab = ref('overview')

const { query, variables } = getEvent(parseInt(props.eventId))
const { result, loading, error} = useQuery(query, variables)

watch(result, (newResult) => {
    if (newResult) {
        event.value = newResult.events[0]
    }
}, {immediate: true})

watch(error, (newError) => {
    if (newError) {
        console.error(newError)
    }
})

const updateDocumentTitle = () => {
    document.title = `${unencodeName(props.name)} | TennisHistory`
}

watch(() => props.name, () => {
    updateDocumentTitle()
}, {immediate: true})
</script>

<template>
    <v-sheet
        class="md:!w-4/5 xl:!w-2/3 mx-auto my-10 bg-transparent"
    >
        <v-container
            v-if="event"
        >
            <v-row
                class="bg-indigo-800 rounded-xl p-3"
            >
                <v-spacer />
                <v-col
                    v-if="event.category"
                    class="flex items-center justify-center"
                    cols="7"
                    sm="4"
                    lg="2"
                >
                    <v-img
                        :src="category(event.category)"
                        :alt="event.category"
                    />
                </v-col>
                <v-col
                class="text-zinc-300 text-center sm:!text-left"
                    cols="12"
                    sm="8"
                    lg="10"
                >
                    <div>
                        <router-link
                            class="hover-link text-2xl"
                            :to="{name: 'Tournament'}"
                        >
                            {{ unencodeName(name) }}
                        </router-link>
                    </div>
                    <div>{{ event.sponsor_name ?? '' }}</div>
                    <div>{{ formattedDates(event.start_date, event.end_date) }}</div>
                </v-col>
            </v-row>
            <v-row
                class="mt-10"
            >
                <v-col>
                    <v-toolbar
                        class="rounded-t-xl bg-zinc-700"
                    >
                        <v-tabs
                            v-model="tab"
                            show-arrows
                            color="#d4d4d8"
                        >
                            <v-tab
                                value="overview"
                                :to="{name: 'Event'}"
                            >
                                Overview
                            </v-tab>
                            <v-tab
                                v-if="event.draw_type !== 'Team'"
                                value="results"
                            >
                                Results
                            </v-tab>
                            <v-tab
                                v-if="event.draw_type !== 'Team'"
                            >
                                Draw
                            </v-tab>
                        </v-tabs>
                    </v-toolbar>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <router-view />
                </v-col>
            </v-row>
        </v-container>
        <div
            v-else
            class="text-zinc-400"
        >
            No data available
        </div>
    </v-sheet>
</template>