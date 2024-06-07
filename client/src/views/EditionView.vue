<script setup lang="ts">
import { onMounted, ref, type Ref, watch } from 'vue';
import { useDisplay } from 'vuetify';
import EditionService from '@/services/EditionService';
import OverviewWindow from '@/components/Edition/OverviewWindow.vue';
import { categorySrc, formattedDates } from '@/components/utils';
import type { EditionDetails, MatchScore } from '@/components/interfaces';
import ResultsWindow from '@/components/Edition/ResultsWindow.vue';
import DrawWindow from '@/components/Edition/DrawWindow.vue';

const props = defineProps<{
    editionNo: string,
    name: string,
    id: string
}>()
const { xs } = useDisplay()

const edition: Ref<EditionDetails | null> = ref(null)
const matches: Ref<MatchScore[]> = ref([])
const tab = ref('overview')

onMounted(() => {
    EditionService.getEditionById(parseInt(props.editionNo))
    .then(response => {
        edition.value = response.data
        matches.value = response.data.MatchScores
    })
    .catch(e => console.log(e))
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
                            <v-tab value="overview">Overview</v-tab>
                            <v-tab
                                v-if="edition.type_of_draw !== 'T'"
                                value="results"
                            >
                                Results
                            </v-tab>
                            <v-tab
                                v-if="edition.type_of_draw === 'T'"
                                value="group"
                            >
                                Group Stages
                            </v-tab>
                            <v-tab
                                v-if="edition.type_of_draw !=='T'"
                                value="draw"
                            >
                                Draw
                            </v-tab>
                            <v-tab
                                v-if="edition.type_of_draw === 'T'"
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
                    <v-window v-model="tab">
                        <v-window-item value="overview">
                            <OverviewWindow :edition />
                        </v-window-item>
                        <v-window-item value="results">
                            <ResultsWindow :matches :edition :name :id/>
                        </v-window-item>
                        <v-window-item value="group"></v-window-item>
                        <v-window-item value="draw">
                            <DrawWindow :matches :edition :name :id />
                        </v-window-item>
                        <v-window-item value="teamKO"></v-window-item>
                    </v-window>
                </v-col>
            </v-row>
        </v-container>
        <div v-else class="text-zinc-400">No data available</div>
    </v-sheet>
</template>