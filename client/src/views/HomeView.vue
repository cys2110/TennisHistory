<script setup lang="ts">
import EditionService from '@/services/EditionService';
import UpcomingCard from '@/components/Home/UpcomingCard.vue';
import { onMounted, ref, type Ref } from 'vue';
import type { UpcomingEdition } from '@/components/interfaces';

const upcoming: Ref<UpcomingEdition[]> = ref([])

onMounted(() => {
    EditionService.getUpcomingEditions()
    .then(response => upcoming.value = response.data)
    .catch(error => console.log(error))
})
</script>

<template>
    <view-sheet>
        <div class="!text-4xl !text-zinc-300">Upcoming Tournaments</div>
        <div v-if="upcoming.length > 0">
            <UpcomingCard v-for="edition in upcoming" :key="edition.id" :edition />
        </div>
        <div v-else class="!text-zinc-400 my-5">No upcoming tournaments</div>
    </view-sheet>
</template>