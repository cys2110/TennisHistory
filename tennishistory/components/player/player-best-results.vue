<script setup lang="ts">
import { useChangeCase } from "@vueuse/integrations";

const emits = defineEmits<{ (e: "update:showMessage", value: string | boolean): void }>();
const route = useRoute();
const pid = ref(route.params.pid);

// API call
const {
    data: results,
    status,
    error
} = await useFetch<Record<MajorTournaments, PlayerBestResultsType>[]>("/api/getPlayerBestResults", {
    query: { pid },
    onResponse({ response }) {
        if (response.status === 204) emits("update:showMessage", "success");
    },
    onResponseError({ error }) {
        if (error) emits("update:showMessage", "error");
    }
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

const columns = [
    { header: "Tournament", class: "text-center text-base" },
    { header: "Round", class: "text-center text-base" },
    { header: "Years Achieved", class: "text-base" }
];
</script>

<template>
    <prime-fieldset
        class="mt-5"
        legend="Major Results"
    >
        <shadcn-table class="w-fit mx-auto">
            <shadcn-table-header>
                <shadcn-table-row>
                    <shadcn-table-head
                        v-for="column in columns"
                        :key="column.header"
                        :class="column.class"
                    >
                        {{ column.header }}
                    </shadcn-table-head>
                </shadcn-table-row>
            </shadcn-table-header>
            <shadcn-table-body>
                <shadcn-table-row
                    v-for="result in results"
                    :key="result.tid"
                    class="border-none"
                >
                    <shadcn-table-cell class="text-center">
                        <nuxt-link
                            class="hover-link"
                            :to="`/tournaments/${useChangeCase(result.tname, 'snakeCase').value}/${result.tid}`"
                        >
                            {{ result.tname }}
                        </nuxt-link>
                    </shadcn-table-cell>
                    <shadcn-table-cell class="text-center px-5">{{ result.round }}</shadcn-table-cell>
                    <shadcn-table-cell class="text-center">
                        <div
                            v-for="event in result.events"
                            :key="event.eid"
                        >
                            <nuxt-link
                                class="hover-link"
                                :to="`/tournaments/${useChangeCase(result.tname, 'snakeCase').value}/${result.tid}/${event.year}/${event.eid}`"
                            >
                                {{ event.year }}
                            </nuxt-link>
                        </div>
                    </shadcn-table-cell>
                </shadcn-table-row>
            </shadcn-table-body>
        </shadcn-table>
    </prime-fieldset>
</template>
