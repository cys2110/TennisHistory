<script setup lang="ts">
const props = defineProps<{
    heading: string
}>()
</script>

<template>
    <thead class="text-xs">
        <tr>
            <th
                class="!font-bold text-center !bg-indigo-800 text-zinc-300 uppercase"
                colspan="2"
            >
                {{ heading }}
            </th>
        </tr>
    </thead>
</template>