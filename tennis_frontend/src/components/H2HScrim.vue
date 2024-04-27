<script setup>
import PlayerService from '@/services/PlayerService';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()
const emits = defineEmits(['close'])
const searchP1 = ref(null)
const searchP2 = ref(null)
const p1Results = ref([])
const p2Results = ref([])
const p1Id = ref(null)
const p2Id = ref(null)

const submitSearch1 = () => {
    PlayerService.getPlayerByName(searchP1.value)
    .then(response => {
        p1Results.value = response.data
    })
}

const submitSearch2 = () => {
    PlayerService.getPlayerByName(searchP2.value)
    .then(response => {
        p2Results.value = response.data
    })
}

const setP1 = (player) => {
    searchP1.value = player.full_name
    p1Results.value = []
    p1Id.value = player.id
}

const setP2 = (player) => {
    searchP2.value = player.full_name
    p2Results.value = []
    p2Id.value = player.id
}

const submitH2H = () => {
    if (p1Id.value && p2Id.value) {
        router.push({name: 'H2H', params: {p1Id: p1Id.value, p1Name: searchP1.value, p2Id: p2Id.value, p2Name: searchP2.value}})
        emits('close')
    }
}
</script>

<template>
    <v-card width="60%" class="mx-auto" rounded="xl">
        <v-container class="mx-3 mt-2">
            <v-row>
                    <v-col cols="5">
                        <v-text-field
                            label="Search player 1"
                            variant="underlined"
                            clearable
                            v-model="searchP1"
                            rounded
                            @update:model-value="submitSearch1"
                        >
                        </v-text-field>
                    </v-col>
                    <v-col cols="5">
                        <v-text-field
                            label="Search player 2"
                            variant="underlined"
                            clearable
                            v-model="searchP2"
                            rounded
                            @update:model-value="submitSearch2"
                        >
                        </v-text-field>
                    </v-col>
                    <v-spacer></v-spacer>
                    <v-col cols="1" class="d-flex align-center">
                        <v-icon icon="fad fa-right-from-line" @click="submitH2H"></v-icon>
                    </v-col>
            </v-row>
            <v-row>
                <v-col cols="5">
                    <v-list v-if="p1Results.length > 0">
                        <v-list-item v-for="player in p1Results" :key="player.id" @click="setP1(player)">{{ player.full_name }}</v-list-item>
                    </v-list>
                </v-col>
                <v-col cols="5">
                    <v-list v-if="p2Results.length > 0">
                        <v-list-item v-for="player in p2Results" :key="player.id" @click="setP2(player)">{{ player.full_name }}</v-list-item>
                    </v-list>
                </v-col>
            </v-row>
        </v-container>
    </v-card>
</template>