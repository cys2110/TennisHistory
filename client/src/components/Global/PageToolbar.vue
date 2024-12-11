<script setup lang="ts">
const props = defineProps<{
    pages: { title: string, name: string }[]
}>()
</script>

<template>
    <Toolbar class="mb-5 flex justify-evenly">
        <template #start>
            <slot name="start" />
        </template>
        <template #center>
            <slot name="center" />
        </template>
        <template #end>
            <div class="flex flex-col md:flex-row md:items-center md:justify-center items-start">
                <Button v-for="page in pages" :key="page.title" as="router-link" :label="page.title" size="small"
                    rounded class="m-2" raised :to="{ name: page.name }" />
            </div>
        </template>
    </Toolbar>
</template>