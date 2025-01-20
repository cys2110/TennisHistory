<script setup lang="ts">
const emits = defineEmits<{ (e: "update:showMessage", value: string | boolean): void }>();
const route = useRoute();
const eid = ref(route.params.eid);
const checked = ref(false);

const handleResponse = ({ response }: { response: Response }) => {
    if (response.status === 204) emits("update:showMessage", "success");
};

const handleError = ({ error }: { error: any }) => {
    if (error) emits("update:showMessage", "error");
};

// API call
const {
    data: entries,
    status,
    error
} = await useFetch<EventEntryType[]>("/api/getEventEntries", {
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
</script>

<template>
    <prime-fieldset
        v-if="entries"
        id="entries"
        legend="Entries"
        class="my-10 px-10 w-fit mx-auto"
    >
        <div class="w-full flex justify-end mb-3">
            <shadcn-switch
                :checked
                @update:checked="checked = $event"
            >
                <template #thumb>
                    <Icon
                        :name="checked ? 'ph:table-duotone' : 'clarity:view-cards-line'"
                        class="text-emerald-600"
                    />
                </template>
            </shadcn-switch>
        </div>
        <event-entries-table
            v-if="!checked"
            :entries
        />
        <event-entries-cards
            v-else
            :entries
        />
    </prime-fieldset>
</template>
