<script setup lang="ts">
const props = defineProps<{
    id?: string;
    type: string;
    item?: { name: string; city: string };
}>();

const apiRoute = computed(() => {
    switch (props.type) {
        case "Venues":
            return "/api/getVenueResults";
        default:
            return "/api/getEventsResults";
    }
});

const apiParams = computed(() => {
    switch (props.type) {
        case "Venues":
            return { name: props.item?.name, city: props.item?.city };
        case "Surfaces":
            return { id: props.id, label: "Surface", relationship: "ON_SURFACE" };
        case "Supervisors":
            return { id: props.id, label: "Supervisor", relationship: "SUPERVISED" };
        default:
            return {};
    }
});

const { data: events, status, error } = await useFetch(apiRoute.value, { query: apiParams.value });
</script>

<template>
    <div
        v-if="events"
        class="grid grid-cols-3 gap-5"
    >
        <div
            v-for="event in events"
            :key="event.eid"
            class="p-5 flex items-center justify-center border border-solid border-emerald-600 rounded-xl"
        >
            <nuxt-link
                class="hover-link text-zinc-300"
                :to="`/tournaments/${encodeName(event.name)}/${event.tid}/${event.year}/${event.eid}`"
            >
                {{ event.name }} {{ event.year }}
            </nuxt-link>
        </div>
    </div>
</template>
