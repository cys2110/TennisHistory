<script setup lang="ts">
const props = defineProps<{ stats: PlayerStatsType[] }>();

const columns = ["Category", ""];
</script>

<template>
    <shadcn-table>
        <shadcn-table-header>
            <shadcn-table-row>
                <shadcn-table-head
                    v-for="column in columns"
                    :key="column"
                >
                    {{ column }}
                </shadcn-table-head>
            </shadcn-table-row>
        </shadcn-table-header>
        <shadcn-table-body>
            <shadcn-table-row
                v-for="stat in stats"
                :key="stat.category"
            >
                <shadcn-table-cell>{{ stat.category }}</shadcn-table-cell>
                <shadcn-table-cell>{{ stat.value.low }}{{ stat.suffix === false ? null : "%" }}</shadcn-table-cell>
            </shadcn-table-row>
        </shadcn-table-body>
    </shadcn-table>
</template>

<!-- <style scoped>
:deep(thead) {
    @apply bg-violet-800;
}

:deep(th > span) {
    @apply font-bold text-base text-zinc-400;
}

:deep(th:last-of-type) {
    @apply !rounded-tr-lg;
}

:deep(th:last-of-type > span) {
    @apply !rounded-tr-lg;
}
</style> -->
