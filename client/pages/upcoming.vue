<script setup lang="ts">
definePageMeta({ name: "upcoming" });
useHead({ title: "Upcoming Tournaments" });

// Filters
const selectedSurfaces = ref(FILTERED_SURFACES);
const selectedMonths = ref(MONTH_NAMES);
const selectedCategories = ref(FILTERED_CATEGORIES);

// Api calls
const { data: events, status, error } = await useFetch<EventCardType[]>("/api/getUpcomingTournaments", { query: { surfaces: selectedSurfaces, months: selectedMonths, categories: selectedCategories } });

// Anchor links
const links = computed(() => {
	if (events.value) {
		return events.value.map(event => ({
			label: event.tname,
			to: `#${event.eid}`
		}));
	}
});
</script>

<template>
	<u-page>
		<u-page-header title="Upcoming Tournaments" />
		<u-page-body>
			<u-container class="lg:hidden flex flex-col justify-evenly gap-2">
				<surface-select v-model="selectedSurfaces" />
				<month-select v-model="selectedMonths" />
				<category-select v-model="selectedCategories" />
			</u-container>
			<events-grid
				v-if="events && events.length > 0"
				:events
			/>
			<error-message
				v-else
				:status
				:error
				icon="i-pepicons-print-calendar-circle-off"
			>
				<template #pending>Upcoming events are currently being fetched</template>
				<template #error>No upcoming events</template>
			</error-message>
		</u-page-body>
		<template #right>
			<u-page-aside>
				<u-container>
					<div>Filters</div>
					<surface-select v-model="selectedSurfaces" />
					<month-select v-model="selectedMonths" />
					<category-select v-model="selectedCategories" />
				</u-container>
				<u-page-anchors :links />
			</u-page-aside>
		</template>
	</u-page>
</template>
