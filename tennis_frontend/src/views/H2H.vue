<script setup>
import H2HService from '@/services/H2HService';
import { onMounted, ref } from 'vue';

const p1 = ref({
    id: 's0ag'
})
const p2 = ref({
    id: 'd875'
})

const matches = ref([])
const winPercent = ref(0)

const searchH2H = () => {
    H2HService.h2h(p1.value.id, p2.value.id)
    .then(response => {
        matches.value = response.data.matches
        winPercent.value = Math.round((response.data.p1Wins / (response.data.p1Wins + response.data.p2Wins) * 100))
        console.log(response)
    })
    .catch(error => console.log(error))
}

onMounted(() => {
    searchH2H()
})
</script>

<template>
    <v-sheet v-if="matches.length > 0" class="bg-transparent my-10 pa-3 w-75 mx-auto">
        <v-container>
            <v-row>
                <v-col>
                    <div>Avatar</div>
                    <div>Search name</div>
                </v-col>
                <v-col>
                    <div><v-progress-circular :model-value="winPercent" :size="100"></v-progress-circular>{{ winPercent }}</div>
                </v-col>
                <v-col>
                    <div>Avatar</div>
                    <div>Search name</div>
                </v-col>
            </v-row>
            <v-row>
                <v-col>Stats</v-col>
                <v-col>H2H</v-col>
                <v-col>Stats</v-col>
            </v-row>
            <v-row>
                <div>Event Breakdown</div>
                
            </v-row>
        </v-container>
    </v-sheet>
</template>