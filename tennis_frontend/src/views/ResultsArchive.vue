<script setup>
import { ref, watch } from 'vue'
import EditionService from '@/services/EditionService';
import ArchiveCard from '@/components/ArchiveCard.vue';

const years = Array.from({length: 2025-1968}, (_, index) => 2024 - index)
const searchYear = ref(2024)
const results = ref([])

watch(searchYear, () => {
    if (searchYear.value !== '') {
        EditionService.getEditionsByYear(searchYear.value)
        .then(response => results.value = response.data)
        .catch(error => console.log(error))
    }
}, {immediate: true})

</script>

<template>
    <v-sheet class="bg-transparent my-10 pa-3 w-75 mx-auto">
        <v-container>
            <v-row>
                <v-col>
                    <div class="text-h3">Results Archive</div>
                </v-col>
                <v-col>
                    <v-combobox
                        variant="underlined"
                        class="ml-auto"
                        v-model="searchYear"
                        :items="years"
                        style="width: 15%;"
                    >
                    </v-combobox>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <div v-if="results.length > 0">
                        <ArchiveCard v-for="result in results" :key="result.id" :edition="result" />
                    </div>
                    <div class="text-subtitle-1 my-5" v-else>No data available yet</div>
                </v-col>
            </v-row>
        </v-container>
    </v-sheet>
</template>