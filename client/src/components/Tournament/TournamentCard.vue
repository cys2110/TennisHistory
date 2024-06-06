<script setup lang="ts">
import { computed, ref, type Ref } from 'vue';
import { DateTime } from 'luxon';
import { headshot, flagSrc, encodeName } from '../utils';
import type { EditionsOfTournament } from '../interfaces';

const props = defineProps<{
    edition: EditionsOfTournament
}>()
const display: Ref<boolean> = ref(true)
const noFinal: Ref<boolean> = ref(false)

DateTime.fromISO(props.edition.end_date) < DateTime.now() ? display.value = true : display.value = false
props.edition.final_score ? noFinal.value = false : noFinal.value = true

const formattedScore = computed(() => {
    if (props.edition.final_score) {
        return props.edition.final_score.replace(/\(/g, '<sup>').replace(/\)/g, '</sup>')
    }
});
</script>

<template>
    <short-card class="md:min-h-64">
        <v-container>
            <v-row>
                <v-col class="text-center text-2xl">
                    <router-link
                        class="hover-link"
                        :to="{name: 'Edition', params: {editionNo: edition.edition_no}}"
                    >
                        {{ edition.year }}
                    </router-link>
                </v-col>
            </v-row>
            <v-row 
                v-if="display && !noFinal"
                dense
            >
                <v-col 
                    class="flex items-center mx-0.5"
                    cols="2"
                >
                    <flag-img
                        :src="flagSrc(edition.winner.country)"
                        :alt="edition.winner.country"
                    />
                </v-col>
                <v-col
                    class="flex items-center mx-0.5"
                    cols="2"
                >
                    <v-avatar>
                        <v-img
                            :src="headshot(edition.winner.id)"
                            :alt="edition.winner.full_name"
                        />
                    </v-avatar>
                </v-col>
                <v-col class="flex items-center mx-2">
                    <router-link
                        class="hover-link"
                        :to="{name: 'Player', params: {id: edition.winner.id, name: encodeName(edition.winner.full_name)}}"
                    >
                        {{ edition.winner.full_name }}
                    </router-link>
                </v-col>
            </v-row>
            <v-row v-if="display && !noFinal">
                <v-col class="text-center text-zinc-300">d.</v-col>
            </v-row>
            <v-row
                v-if="display && !noFinal"
                dense
            >
                <v-col
                    class="flex items-center mx-0.5"
                    cols="2"
                >
                    <flag-img
                        :src="flagSrc(edition.finalist.country)"
                        :alt="edition.finalist.country"
                    />
                </v-col>
                <v-col
                    class="flex items-center mx-0.5"
                    cols="2"
                >
                    <v-avatar>
                        <v-img
                            :src="headshot(edition.finalist.id)"
                            :alt="edition.finalist.full_name"
                        />
                    </v-avatar>
                </v-col>
                <v-col class="flex items-center mx-2">
                    <router-link
                        class="hover-link"
                        :to="{name: 'Player', params: {id: edition.finalist.id, name: encodeName(edition.finalist.full_name)}}"
                    >
                        {{ edition.finalist.full_name }}
                    </router-link>
                </v-col>
            </v-row>
            <v-row v-if="display && !noFinal">
                <v-col class="text-center text-zinc-300" v-html="formattedScore" />
            </v-row>
            <!--If no final played-->
            <v-row 
                v-if="display && noFinal"
                class="text-center text-zinc-300"
            >
                <v-col>No final played</v-col>
            </v-row>

            <!--If tournament currently in progress-->
            <v-row
                v-if="!display"
                class="text-center text-zinc-300"
            >
                <v-col>Currently in progress</v-col>
            </v-row>
        </v-container>
    </short-card>
</template>