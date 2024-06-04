<script setup lang="ts">
import EditionService from '@/services/EditionService';
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
    </view-sheet>
</template>