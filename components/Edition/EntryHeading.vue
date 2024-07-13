<script setup lang="ts">
const props = defineProps<{
    heading: string
}>()
</script>

<template>
    <thead class="text-xs text-zinc-300">
        <tr>
            <th
                class="!font-bold text-center !bg-indigo-800"
                colspan="2"
            >
                {{ heading }}
            </th>
        </tr>
    </thead>
</template>