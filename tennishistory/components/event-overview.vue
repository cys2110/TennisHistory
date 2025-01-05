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
    data: event,
    status,
    error
} = await useFetch<EventDetailsType>("/api/getEventDetails", {
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

// Get country code for icons
const countryCode = computed(() => {
    if (event.value) return getCountryCode(event.value.country);
});

const fieldsetItems = computed(() => {
    if (event.value) {
        return [
            { legend: "Sponsor name", description: event.value.ename ?? "—" },
            { legend: "Category", description: event.value.category ?? "—" },
            { legend: "Dates", description: event.value.dates },
            { legend: "Surface", description: event.value.surface },
            { legend: "Venue" },
            { legend: event.value.supervisors.length === 1 ? "Supervisor" : "Supervisors" },
            { legend: "Prize money", description: event.value.pm ? `${CURRENCIES[event.value.currency as keyof typeof CURRENCIES]}${event.value.pm}` : "—" },
            { legend: "Total financial commitment", description: event.value.tfc ? `${CURRENCIES[event.value.currency as keyof typeof CURRENCIES]}${event.value.tfc}` : "—" },
            { legend: "Draw type", description: event.value.draw }
        ];
    }
});
</script>

<template>
    <div
        v-if="event"
        id="details"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5 mt-5"
    >
        <prime-fieldset
            v-for="item in fieldsetItems"
            :key="item.legend"
            :legend="item.legend"
        >
            <template v-if="item.legend === 'Venue'">
                <div class="flex gap-1 items-center">
                    <span v-if="event.venue">{{ event.venue }},&nbsp;</span>
                    <span>{{ event.city }}</span>
                    <span>
                        <Icon
                            v-if="countryCode"
                            :name="`flag:${countryCode}-4x3`"
                            class="rounded border border-zinc-400"
                        />
                        <component
                            v-else
                            :is="`Icons${event.country}`"
                        />
                    </span>
                </div>
            </template>
            <template v-else-if="item.legend === 'Supervisors' || item.legend === 'Supervisor'">
                <div
                    v-if="event.supervisors.length > 0"
                    v-for="id in event.supervisors"
                    :key="id"
                >
                    {{ id }}
                </div>
                <div v-else>—</div>
            </template>
            <template v-else>
                {{ item.description }}
            </template>
        </prime-fieldset>
    </div>
</template>
