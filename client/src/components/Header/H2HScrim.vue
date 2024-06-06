<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { useDisplay } from 'vuetify';
import PlayerService from '@/services/PlayerService';
import { encodeName, flagSrc, headshot } from '../utils';
import type { Player } from '../interfaces';

const { mdAndUp, smAndUp } = useDisplay()

const searchP1: Ref<string> = ref('')
const searchP2: Ref<string> = ref('')
const p1Results: Ref<Player[]> = ref([])
const p2Results: Ref<Player[]> = ref([])
const p1Id: Ref<string | null> = ref(null)
const p2Id: Ref<string | null> = ref(null)

const submitSearch1 = () => {
    PlayerService.getPlayerByName(searchP1.value)
    .then(response => p1Results.value = response.data)
    .catch(e => console.log(e))
}
const submitSearch2 = () => {
    PlayerService.getPlayerByName(searchP2.value)
    .then(response => p2Results.value = response.data)
    .catch(e => console.log(e))
}

const setP1 = (player: Player) => {
    searchP1.value = player.full_name
    p1Results.value = []
    p1Id.value = player.id
}
const setP2 = (player: Player) => {
    searchP2.value = player.full_name
    p2Results.value = []
    p2Id.value = player.id
}
</script>

<template>
    <short-card
        class="mx-auto"
        :width="smAndUp ? '60%' : '100%'"
    >
        <v-container>
            <v-row>
                <v-col
                    cols="12"
                    md="5"
                    order="1"
                >
                    <v-text-field
                        label="Search player 1"
                        variant="underlined"
                        clearable
                        rounded
                        autofocus
                        v-model="searchP1"
                        @update:model-value="submitSearch1"
                    />
                </v-col>
                <v-col
                    cols="12"
                    md="5"
                    :order="mdAndUp ? 2 : 3"
                >
                    <v-text-field
                        label="Search player 2"
                        variant="underlined"
                        clearable
                        rounded
                        v-model="searchP2"
                        @update:model-value="submitSearch2"
                    />
                </v-col>
                <v-col
                    class="justify-center flex items-center"
                    :order="mdAndUp ? 3 : 5"
                >
                    <v-chip
                        v-if="p1Id && p2Id"
                        text="Submit"
                        :to="{name: 'H2H', params: {p1Name: encodeName(searchP1), p1Id: p1Id, p2Name: encodeName(searchP2), p2Id: p2Id}}"
                        @click="$emit('close')"
                        variant="text"
                    />
                </v-col>
                <v-col
                    v-if="p1Results.length > 0 || mdAndUp"
                    cols="12"
                    md="5"
                    :order="mdAndUp ? 4: 2"
                >
                    <div>
                        <div
                            v-for="player in p1Results"
                            :key="player.id"
                            class="my-0.5 flex items-center"
                            @click="setP1(player)"
                        >
                            <div class="w-1/6 mx-0.5">
                                <flag-img
                                    :src="flagSrc(player.country)"
                                    :alt="player.country"
                                />
                            </div>
                            <div class="mx-0.5">
                                <v-avatar>
                                    <v-img
                                        :src="headshot(player.id)"
                                        :alt="player.full_name"
                                    />
                                </v-avatar>
                            </div>
                            <div class="hover-link mx-0.5">{{ player.full_name }}</div>
                        </div>
                    </div>
                </v-col>
                <v-col
                    v-if="p2Results.length > 0 || mdAndUp"
                    cols="12"
                    md="5"
                    :order="mdAndUp ? 5: 4"
                >
                    <div>
                        <div
                            v-for="player in p2Results"
                            :key="player.id"
                            class="my-0.5 flex items-center"
                            @click="setP2(player)"
                        >
                            <div class="w-1/6 mx-0.5">
                                <flag-img
                                    :src="flagSrc(player.country)"
                                    :alt="player.country"
                                />
                            </div>
                            <div class="mx-0.5">
                                <v-avatar>
                                    <v-img
                                        :src="headshot(player.id)"
                                        :alt="player.full_name"
                                    />
                                </v-avatar>
                            </div>
                            <div class="hover-link mx-0.5">{{ player.full_name }}</div>
                        </div>
                    </div>
                </v-col>
            </v-row>
        </v-container>
    </short-card>
</template>