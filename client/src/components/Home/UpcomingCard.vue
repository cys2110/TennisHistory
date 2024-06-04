<script setup lang="ts">
import { categorySrc, flagSrc, formattedDates, encodeName, type UpcomingEdition } from '../utils';
import { useRouter } from 'vue-router';
import { DateTime } from 'luxon'
import { useDisplay } from 'vuetify';

const props = defineProps<{
    edition: UpcomingEdition
}>()
const router = useRouter()
const { smAndDown } = useDisplay()
</script>

<template>
    <v-card
        class="my-4 sm:!my-5 !bg-indigo-800 lg:w-4/5 mx-auto"
        :rounded="smAndDown ? 'xl' : 'pill'"
        variant="text"
    >
        <v-container>
            <v-row>
                <v-col cols="12" sm="3" class="flex items-center">
                    <v-img
                        v-if="edition.category"
                        :src="categorySrc(edition.category)"
                        :alt="edition.category"
                        class="!size-20 mx-auto"
                    />
                </v-col>
                <v-col cols="12" sm="7" class="text-center sm:!text-left">
                    <div
                        v-if="edition.sponsor_name"
                        class="!text-zinc-300 py-0.5 text-xl"
                    >
                        {{ edition.sponsor_name }}
                    </div>
                    <div
                        class="text-xl py-0.5"
                    >
                        <router-link
                            :to="{name: 'Tournament', params: {name: encodeName(edition.Tournament.name), id: edition.Tournament.id}}"
                            class="hover-link"
                        >
                            {{ edition.Tournament.name }}
                        </router-link>
                    </div>
                    <div
                        class="!text-zinc-300 !flex-col py-0.5"
                    >
                        <div class="flex justify-center sm:!justify-start">
                            <div>{{ edition.city }}</div>
                            <div
                                class="!w-9"
                            >
                                <flag-img
                                    :src="flagSrc(edition.country)"
                                    :alt="edition.country"
                                    class="mx-1"
                                />
                            </div>
                        </div>
                        <div class="py-0.5">{{ formattedDates(edition.start_date, edition.end_date) }}</div>
                        <div class="py-0.5">{{ edition.environment }} {{ edition.surface }}
                        <span v-if="edition.hard_type"> ({{ edition.hard_type }})</span></div>
                    </div>
                </v-col>
                <v-col class="text-center flex items-center" cols="12" sm="2" >
                    <!--navigate-->
                    <v-chip
                        v-if="DateTime.now() > DateTime.fromISO(edition.start_date)"
                        variant="outlined"
                    >
                        Results
                    </v-chip>
                </v-col>
            </v-row>
        </v-container>
    </v-card>
</template>