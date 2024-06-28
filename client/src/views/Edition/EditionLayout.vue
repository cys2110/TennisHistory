<script setup lang="ts">
import { ref, type Ref, watch } from 'vue';
import { provideApolloClient, useQuery } from '@vue/apollo-composable';
import apolloClient from '@/apollo';
import { useDisplay } from 'vuetify';
import { getEdition } from '@/services/APICalls';
import { categorySrc, formattedDates } from '@/components/utils';
import type { Edition } from '@/components/interfaces';

provideApolloClient(apolloClient)

const props = defineProps<{
    editionNo: string,
    name: string,
    id: string
}>()
const { xs } = useDisplay()

const edition: Ref<Edition | null> = ref(null)
const tab = ref('overview')

const { query, variables } = getEdition(parseInt(props.editionNo))
const { result, loading, error} = useQuery(query, variables)

watch(result, (newResult) => {
    if (newResult) {
        console.log(newResult)
        edition.value = newResult.events[0]
    }
}, {immediate: true})

watch(error, (newError) => {
    if (newError) {
        console.error(newError)
    }
})

const updateDocumentTitle = () => {
    const tournamentName = props.name.replace(/_/g, ' ')
    document.title = `${tournamentName} | TennisHistory`
}

watch(() => props.name, () => {
    updateDocumentTitle()
}, {immediate: true})
</script>

<template>
    <v-sheet class="md:!w-4/5 xl:!w-2/3 mx-auto my-10 bg-transparent">
        <v-container v-if="edition">
            <v-row class="bg-indigo-800 rounded-xl p-3">
                <v-col
                    v-if="xs"
                    cols="2"
                />
                <v-col
                    v-if="edition.category"
                    class="flex items-center justify-center"
                    cols="7"
                    sm="4"
                    lg="2"
                >
                    <v-img
                        :src="categorySrc(edition.category)"
                        :alt="edition.category"
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
                            {{ name.replace(/_/g, ' ') }}
                        </router-link>
                    </div>
                    <div>{{ edition.sponsor_name ?? '' }}</div>
                    <div>{{ formattedDates(edition.start_date, edition.end_date) }}</div>
                </v-col>
            </v-row>
            <v-row class="mt-10">
                <v-col>
                    <v-toolbar class="rounded-t-xl bg-zinc-700">
                        <v-tabs
                            v-model="tab"
                            show-arrows
                            color="#d4d4d8"
                        >
                            <v-tab
                                value="overview"
                                :to="{name: 'Edition'}"
                            >
                                Overview
                            </v-tab>
                            <v-tab
                                v-if="edition.draw_type !== 'Team'"
                                value="results"
                                :to="{name: 'Results'}"
                            >
                                Results
                            </v-tab>
                            <v-tab
                                v-if="edition.draw_type === 'Team'"
                                value="group"
                            >
                                Group Stages
                            </v-tab>
                            <v-tab
                                v-if="edition.draw_type !=='Team'"
                                value="draw"
                            >
                                Draw
                            </v-tab>
                            <v-tab
                                v-if="edition.draw_type === 'Team'"
                                value="teamKO"
                            >
                                Knockout Stages
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
        <div v-else class="text-zinc-400">No data available</div>
    </v-sheet>
</template>