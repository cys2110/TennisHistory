<script setup>
const props = defineProps(['score'])
const scoreArray = Array.from({ length: 5 }, (_, i) => i + 1)
</script>

<template>
    <div class="flex justify-end w-full">
        <div v-for="set in scoreArray" class="mr-1">{{ score[`s${set}`] }}<sup>{{ score[`t${set}`] }}</sup></div>
    </div>
</template>