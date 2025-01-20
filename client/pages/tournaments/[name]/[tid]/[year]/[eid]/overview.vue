<script setup lang="ts">
import { useChangeCase } from "@vueuse/integrations/useChangeCase";
definePageMeta({ name: "event" });
const route = useRoute();

const { data: event, status, error } = await useFetch<EventDetailsType>("/api/getEventDetails", { query: { id: route.params.eid } });

useHead({ title: `${event.value?.name ?? useChangeCase(route.params.name as string, "capitalCase").value} ${route.params.year}` });

const sidebarLinks = [
	{ label: "Event Details", to: "#details" },
	{ label: "Awards", to: "#awards" },
	{ label: "Seeds", to: "#seeds" },
	{ label: "Entry Information", to: "#entry-info" },
	{ label: "Entries", to: "#entries" }
];

const eventDetails = computed(() => {
	if (event.value) {
		return [
			{ title: "Dates", description: event.value.dates },
			{ title: "Category", description: event.value.surface },
			{ title: "Venue", description: `${event.value.venue}, ${event.value.city}`, icon: `flag:${COUNTRY_CODES[event.value.country]}-4x3` },
			{ title: event.value.supervisors.length === 1 ? "Supervisor" : "Supervisors" },
			{ title: "Prize money", description: event.value.pm ? `${CURRENCIES[event.value.currency]}${event.value.pm}` : "—" },
			{ title: "Total financial commitment", description: event.value.tfc ? `${CURRENCIES[event.value.currency]}${event.value.tfc}` : "—" }
		];
	}
});
</script>

<template>
	<u-page>
		<u-page-header
			headline="Events"
			description="Event Details"
			:links="EVENT_PAGES"
		>
			<template #title>{{ event?.name ?? useChangeCase(route.params.name as string, "capitalCase").value }} {{ route.params.year }}</template>
		</u-page-header>
		<u-page-body>
			<u-page-section
				v-if="event"
				:title="event.name"
				:features="eventDetails"
			>
				<template
					#description
					v-if="event.ename"
				>
					{{ event.ename }}
				</template>
			</u-page-section>
			<u-alert
				v-else
				variant="subtle"
				:color="status === 'pending' ? 'primary' : 'warning'"
				:icon="status === 'pending' ? 'i-line-md-loading-twotone-loop' : 'i-pepicons-print-info-circle-off'"
				:ui="{ icon: 'size-6', title: 'text-lg', root: 'w-3/4s mx-auto' }"
			>
				<template #title>{{ status === "pending" ? "Event details are currently being fetched" : "No details available" }}</template>
			</u-alert>
			<u-page-columns>
				<event-awards />
				<entry-info />
				<seeds />
				<entries />
			</u-page-columns>
		</u-page-body>
		<template #right>
			<u-page-aside>
				<u-page-anchors :links="sidebarLinks" />
			</u-page-aside>
		</template>
	</u-page>
</template>
