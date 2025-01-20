<script setup lang="ts">
import { useChangeCase } from "@vueuse/integrations/useChangeCase";

const props = defineProps<{ type: string; id: string; name?: string; description: string; title: string }>();

const apiRoute = computed(() => {
	switch (props.type) {
		case "venues":
			return "/api/getVenueResults";
		default:
			return "/api/getEventsResults";
	}
});

const apiParams = computed(() => {
	switch (props.type) {
		case "venues":
			return { name: props.name, city: props.id };
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
	<u-modal
		:title
		:description
	>
		<template #body>
			<u-page-grid v-if="events">
				<u-page-card
					v-for="event in events"
					:key="event.id"
					:title="event.name"
					:to="`/tournaments/${useChangeCase(event.name, 'kebabCase').value}/${event.tid}/${event.year}/${event.eid}`"
				/>
			</u-page-grid>
		</template>
	</u-modal>
</template>

<style scoped></style>
