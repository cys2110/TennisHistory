<script setup lang="ts">
import { onMounted, ref, type Ref, watch } from 'vue';
import { useDisplay } from 'vuetify';
import EditionService from '@/services/EditionService';
import { categorySrc, formattedDates } from '@/components/utils';
import type { EditionDetails, MatchScore } from '@/components/interfaces';

const props = defineProps<{
    editionNo: string,
    name: string
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
    <view-sheet class="lg:!w-3/5 xl:!w-1/2">
        <v-container v-if="edition">
            <v-row class="bg-indigo-800 rounded-xl">
                <v-col
                    v-if="xs"
                    cols="2"
                />
                <v-col
                    v-if="edition.category"
                    class="flex items-center justify-center"
                    cols="7"
                    sm="4"
                >
                    <v-img
                        :src="categorySrc(edition.category)"
                        :alt="edition.category"
                    />
                </v-col>
                <v-col
                    class="text-zinc-300 text-center"
                    cols="12"
                    sm="8"
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
            <v-row>
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
                        <v-window-item value="overview"></v-window-item>
                        <v-window-item value="results"></v-window-item>
                        <v-window-item value="group"></v-window-item>
                        <v-window-item value="draw"></v-window-item>
                        <v-window-item value="teamKO"></v-window-item>
                    </v-window>
                </v-col>
            </v-row>
        </v-container>
        <div v-else class="text-zinc-400">No data available</div>
    </view-sheet>
</template>