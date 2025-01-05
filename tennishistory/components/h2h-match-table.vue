<script setup lang="ts">
const props = defineProps<{ matches: H2HMatch[] }>();
</script>

<template>
    <prime-data-table
        :value="matches"
        size="small"
        class="w-fit mx-auto"
    >
        <prime-column
            field="year"
            sortable
            header="Year"
        >
            <template #sorticon="{ sortOrder }">
                <sort-icon :sortOrder />
            </template>
            <template #body="{ data }">
                <nuxt-link
                    class="hover-link"
                    :to="`/tournaments/${encodeName(data.tname)}/${data.tid}/${data.year}/${data.eid}`"
                >
                    {{ data.year }}
                </nuxt-link>
            </template>
        </prime-column>
        <prime-column
            field="winner"
            sortable
            header="Winner"
        >
            <template #sorticon="{ sortOrder }">
                <sort-icon :sortOrder />
            </template>
            <template #body="{ data }">
                <shadcn-avatar
                    class="border border-zinc-400"
                    size="sm"
                >
                    <shadcn-avatar-image
                        :src="`https://www.atptour.com/-/media/alias/player-headshot/${data.winner}`"
                        :alt="data.name"
                    />
                    <shadcn-avatar-fallback>
                        <Icon name="material-symbols:person-rounded" />
                    </shadcn-avatar-fallback>
                </shadcn-avatar>
            </template>
        </prime-column>
        <prime-column
            field="tname"
            header="Event"
            sortable
        >
            <template #sorticon="{ sortOrder }">
                <sort-icon :sortOrder />
            </template>
            <template #body="{ data }">
                <nuxt-link
                    class="hover-link"
                    :to="`/tournaments/${encodeName(data.tname)}/${data.tid}`"
                >
                    {{ data.tname }}
                </nuxt-link>
            </template>
        </prime-column>
        <prime-column
            field="round"
            header="Round"
            sortable
        >
            <template #sorticon="{ sortOrder }">
                <sort-icon :sortOrder />
            </template>
        </prime-column>
        <prime-column
            field="surface"
            header="Surface"
            sortable
        >
            <template #sorticon="{ sortOrder }">
                <sort-icon :sortOrder />
            </template>
        </prime-column>
        <prime-column header="Score">
            <template #body="{ data }">
                <nuxt-link
                    class="hover-link flex gap-1"
                    :to="`/tournaments/${encodeName(data.tname)}/${data.tid}/${data.year}/${data.eid}`"
                >
                    <span v-if="data.s1">
                        {{ data.s1 }}
                        <sup v-if="data.t1">{{ data.t1 }}</sup>
                    </span>
                    <span v-if="data.s2">
                        {{ data.s2 }}
                        <sup v-if="data.t2">{{ data.t2 }}</sup>
                    </span>
                    <span v-if="data.s3">
                        {{ data.s3 }}
                        <sup v-if="data.t3">{{ data.t3 }}</sup>
                    </span>
                    <span v-if="data.s4">
                        {{ data.s4 }}
                        <sup v-if="data.t4">{{ data.t4 }}</sup>
                    </span>
                    <span v-if="data.s5">
                        {{ data.s5 }}
                        <sup v-if="data.t5">{{ data.t5 }}</sup>
                    </span>
                </nuxt-link>
            </template>
        </prime-column>
    </prime-data-table>
</template>

<!-- <style scoped>
:deep(thead) {
    @apply bg-violet-800;
}

:deep(th > span) {
    @apply font-bold text-base text-zinc-400;
}

:deep(th > button > span) {
    @apply font-bold text-base text-zinc-400;
}
</style> -->
