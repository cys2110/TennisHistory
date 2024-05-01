<script setup>
import EditionService from '@/services/EditionService';
import UpcomingCard from '@/components/UpcomingCard.vue';
import { onMounted, ref } from 'vue';

const upcoming = ref([])

onMounted(() => {
    EditionService.getUpcomingEditions()
    .then(response => upcoming.value = response.data)
    .catch(error => console.log(error))
})
</script>

<template>
    <view-sheet>
        <div class="text-h3">Upcoming Tournaments</div>
        <div v-if="upcoming.length > 0" class="my-10">
            <UpcomingCard v-for="edition in upcoming" :edition :key="edition.id" />
        </div>
        <div v-else class="text-subtitle-1 my-5">No upcoming tournaments</div>
    </view-sheet>
</template>
