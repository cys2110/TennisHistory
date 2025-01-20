<script setup lang="ts">
const props = defineProps<{ entries: EventEntryType[] }>();
</script>

<template>
    <prime-data-table
        :value="entries"
        size="small"
        class="w-fit mx-auto"
    >
        <prime-column
            field="country"
            sortable
        >
            <template #sorticon="{ sortOrder }">
                <sort-icon :sortOrder />
            </template>
            <template #body="{ data }">
                <Icon
                    v-if="getCountryCode(data.country)"
                    :name="`flag:${getCountryCode(data.country)}-4x3`"
                    class="text-base rounded border border-zinc-400"
                />
                <component
                    v-else
                    :is="`Icons${data.country}`"
                />
            </template>
        </prime-column>
        <prime-column field="id">
            <template #body="{ data }">
                <shadcn-avatar
                    class="border border-zinc-400"
                    size="sm"
                >
                    <shadcn-avatar-image
                        :src="`https://www.atptour.com/-/media/alias/player-headshot/${data.id}`"
                        :alt="data.name"
                    />
                    <shadcn-avatar-fallback>
                        <Icon name="material-symbols:person-rounded" />
                    </shadcn-avatar-fallback>
                </shadcn-avatar>
            </template>
        </prime-column>
        <prime-column
            field="name"
            header="Player"
            sortable
            sort-field="last"
        >
            <template #sorticon="{ sortOrder }">
                <sort-icon :sortOrder />
            </template>
            <template #body="{ data }">
                <nuxt-link
                    class="hover-link"
                    :to="`/players/${encodeName(data.name)}/${data.id}`"
                >
                    {{ data.name }}
                </nuxt-link>
            </template>
        </prime-column>
        <prime-column
            field="seed"
            header="Seed"
            sortable
        >
            <template #sorticon="{ sortOrder }">
                <sort-icon :sortOrder />
            </template>
        </prime-column>
        <prime-column
            field="status"
            header="Status"
            sortable
        >
            <template #sorticon="{ sortOrder }">
                <sort-icon :sortOrder />
            </template>
        </prime-column>
        <prime-column
            field="rank"
            header="Rank"
            sortable
        >
            <template #sorticon="{ sortOrder }">
                <sort-icon :sortOrder />
            </template>
        </prime-column>
    </prime-data-table>
</template>
