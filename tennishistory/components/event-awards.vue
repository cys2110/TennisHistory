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
    data: rounds,
    status,
    error
} = await useFetch<EventAwardsType[]>("/api/getEventAwards", {
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
const columns = ["Round", "Prize Money", "Points"];
</script>

<template>
    <prime-fieldset
        v-if="rounds"
        id="awards"
        legend="Awards"
        class="my-10 px-10 w-full"
    >
        <ClientOnly>
            <div class="w-full md:flex justify-end mb-3 hidden">
                <shadcn-dialog class="w-3/4">
                    <shadcn-dialog-trigger>
                        <shadcn-toggle
                            variant="outline"
                            size="sm"
                        >
                            <Icon
                                name="ph:chart-scatter-duotone"
                                class="text-emerald-600"
                            />
                        </shadcn-toggle>
                    </shadcn-dialog-trigger>
                    <shadcn-dialog-content>
                        <shadcn-dialog-header>
                            <shadcn-dialog-title class="text-zinc-400">Awards</shadcn-dialog-title>
                        </shadcn-dialog-header>
                        <event-awards-chart :rounds />
                    </shadcn-dialog-content>
                </shadcn-dialog>
            </div>
        </ClientOnly>
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
                    v-for="round in rounds"
                    :key="round.round"
                >
                    <shadcn-table-cell>{{ round.round }}</shadcn-table-cell>
                    <shadcn-table-cell>{{ CURRENCIES[round.currency] }}{{ round.pm }}</shadcn-table-cell>
                    <shadcn-table-cell>{{ round.points }}</shadcn-table-cell>
                </shadcn-table-row>
            </shadcn-table-body>
        </shadcn-table>
    </prime-fieldset>
</template>
