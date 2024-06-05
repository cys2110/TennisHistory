<script setup lang="ts">
import { computed, ref, type Ref } from 'vue';
import { type EditionsOfTournament, headshot, flagSrc, encodeName } from '../utils';
import { DateTime } from 'luxon'

const props = defineProps<{
    edition: EditionsOfTournament
}>()
const display: Ref<boolean> = ref(true)
const noFinal: Ref<boolean> = ref(false)

DateTime.fromISO(props.edition.end_date) < DateTime.now() ? display.value = true : display.value = false

props.edition.final_score ? noFinal.value = false : noFinal.value = true

const formattedScore = computed(() => {
    //@ts-ignore
    return props.edition.final_score.replaceAll('(', '<sup>').replaceAll(')', '</sup>');
});
</script>

<template>
    <short-card class="md:min-h-64">
        <v-container>
            <v-row>
                <v-col class="text-center text-2xl">
                    <!--routerlink-->
                    {{ edition.year }}
                </v-col>
            </v-row>
            <v-row dense v-if="display && !noFinal">
                <v-col cols="2" class="flex items-center mx-0.5">
                    <flag-img
                        :src="flagSrc(edition.winner.country)"
                        :alt="edition.winner.country"
                    />
                </v-col>
                <v-col cols="2" class="flex items-center mx-0.5">
                    <v-avatar>
                        <v-img
                            :src="headshot(edition.winner.id)"
                            :alt="edition.winner.full_name"
                        />
                    </v-avatar>
                </v-col>
                <v-col class="flex items-center mx-2">
                    <router-link
                        :to="{name: 'Player', params: {id: edition.winner.id, name: encodeName(edition.winner.full_name)}}"
                        class="hover-link"
                    >
                        {{ edition.winner.full_name }}
                    </router-link>
                </v-col>
            </v-row>

            <v-row v-if="display && !noFinal">
                <v-col class="text-center text-zinc-300">d.</v-col>
            </v-row>

            <v-row dense v-if="display && !noFinal">
                <v-col cols="2" class="flex items-center mx-0.5">
                    <flag-img
                        :src="flagSrc(edition.finalist.country)"
                        :alt="edition.finalist.country"
                    />
                </v-col>
                <v-col cols="2" class="flex items-center mx-0.5">
                    <v-avatar>
                        <v-img
                            :src="headshot(edition.finalist.id)"
                            :alt="edition.finalist.full_name"
                        />
                    </v-avatar>
                </v-col>
                <v-col class="flex items-center mx-2">
                    <router-link
                        :to="{name: 'Player', params: {id: edition.finalist.id, name: encodeName(edition.finalist.full_name)}}"
                        class="hover-link"
                    >
                        {{ edition.finalist.full_name }}
                    </router-link>
                </v-col>
            </v-row>

            <v-row v-if="display && !noFinal">
                <v-col class="text-center text-zinc-300" v-html="formattedScore"></v-col>
            </v-row>

            <!--If no final played-->
            <v-row v-if="display && noFinal" class="text-center text-zinc-300">
                <v-col>No final played</v-col>
            </v-row>

            <!--If tournament currently in progress-->
            <v-row v-if="!display" class="text-center text-zinc-300">
                <v-col>Currently in progress</v-col>
            </v-row>
        </v-container>
    </short-card>
</template>