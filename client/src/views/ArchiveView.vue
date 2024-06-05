<script setup lang="ts">
import { DateTime } from 'luxon'
import { ref, watch, type Ref } from 'vue';
import { type ArchiveEdition } from '@/components/utils';
import ArchiveCard from '@/components/Archive/ArchiveCard.vue';
import EditionService from '@/services/EditionService';

const years = Array.from({length: (DateTime.now().year + 1) - 1968}, (_, index) => 2024 - index)
const searchYear: Ref<number> = ref(2024)
const results: Ref<ArchiveEdition[]> = ref([])

watch(searchYear, () => {
    if (searchYear.value !== null && !isNaN(searchYear.value)) {
        EditionService.getEditionsByYear(searchYear.value)
        .then(response => results.value = response.data)
        .catch(e => console.log(e))
    }
}, {immediate: true})
</script>

<template>
    <view-sheet>
        <v-container>
            <v-row class="flex items-center">
                <v-col class="text-3xl text-zinc-300">Results Archive</v-col>
                <v-col cols="12" sm="3">
                    <v-combobox
                        variant="underlined"
                        v-model="searchYear"
                        :items="years"
                        class="text-zinc-300"
                    />
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <div v-if="results.length > 0">
                        <ArchiveCard v-for="edition in results" :key="edition.id" :edition />
                    </div>
                    <div class="text-zinc-400" v-else>No data available.</div>
                </v-col>
            </v-row>
        </v-container>
    </view-sheet>
</template>