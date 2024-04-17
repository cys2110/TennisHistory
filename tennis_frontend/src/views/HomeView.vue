<script setup>
import EditionService from '@/services/EditionService';
import UpcomingCard from '@/components/UpcomingCard.vue';
import { onMounted, ref } from 'vue';

const upcoming = ref([])

onMounted(() => {
    EditionService.getUpcomingEditions()
    .then(response => {
        upcoming.value = response.data
    })
    .catch(error => console.log(error))
})
</script>

<template>
    <main>
        <h1>Upcoming Tournaments</h1>
        <div class="results-wrapper" v-if="upcoming.length > 0">
            <UpcomingCard v-for="edition in upcoming" :edition="edition" :key="edition.id" />
        </div>
        <div class="loading results-wrapper" v-else>Loading...</div>
    </main>
</template>
