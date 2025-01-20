<script setup lang="ts">
const emits = defineEmits<{ (e: "update:showMessage", value: string | boolean): void }>();
const route = useRoute();
const eid = ref(route.params.eid);

const handleResponse = ({ response }: { response: Response }) => {
    if (response.status === 204) emits("update:showMessage", "success");
};

const handleError = ({ error }: { error: any }) => {
    if (error) emits("update:showMessage", "error");
};

// API call
const {
    data: seeds,
    status,
    error
} = await useFetch<EventSeedType[]>("/api/getEventSeeds", {
    query: { eid },
    onResponse: handleResponse,
    onResponseError: handleError
});

watch(status, (newStatus) => {
    if (newStatus === "pending") {
        emits("update:showMessage", "pending");
    } else if (newStatus === "success") {
        emits("update:showMessage", false);
    } else {
        emits("update:showMessage", "error");
    }
});

// Table columns
const columns = [{ field: "seed", label: "Seed" }, { field: "country" }, { field: "name", label: "Player" }, { field: "rank", label: "Rank" }];
</script>

<template>
    <prime-fieldset
        v-if="seeds"
        id="seeds"
        legend="Seeds"
        class="my-10 px-10 w-full flex"
    >
        <ClientOnly>
            <div class="w-full hidden md:flex justify-end mb-3">
                <shadcn-dialog class="w-3/4">
                    <shadcn-dialog-trigger>
                        <shadcn-toggle
                            variant="outline"
                            size="sm"
                        >
                            <Icon
                                name="material-symbols:bar-chart-4-bars-rounded"
                                class="text-emerald-600"
                            />
                        </shadcn-toggle>
                    </shadcn-dialog-trigger>
                    <shadcn-dialog-content>
                        <shadcn-dialog-header>
                            <shadcn-dialog-title class="text-zinc-400">Seeds</shadcn-dialog-title>
                        </shadcn-dialog-header>
                        <event-seeds-chart :seeds />
                    </shadcn-dialog-content>
                </shadcn-dialog>
            </div>
        </ClientOnly>
        <prime-data-table
            :value="seeds"
            size="small"
        >
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
                    <shadcn-avatar class="border border-zinc-400">
                        <shadcn-avatar-image
                            :src="`https://www.atptour.com/-/media/alias/player-headshot/${data.id}`"
                            :alt="data.name"
                            size="sm"
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
                field="rank"
                header="Rank"
                sortable
            >
                <template #sorticon="{ sortOrder }">
                    <sort-icon :sortOrder />
                </template>
            </prime-column>
        </prime-data-table>
    </prime-fieldset>
</template>
