<script setup lang="ts">
const props = defineProps<{
    heading: string
}>()
</script>

<template>
    <v-table class="bg-transparent rounded-xl my-5" fixed-header hover density="compact">
        <thead class="text-xs">
            <tr>
                <th class="!font-bold text-center !bg-indigo-800 text-zinc-300 uppercase" colspan="2">{{ heading }}</th>
            </tr>
        </thead>
        <tbody>
            <slot name="row" />
        </tbody>
    </v-table>
</template>