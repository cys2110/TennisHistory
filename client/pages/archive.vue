<script setup lang="ts">
definePageMeta({ name: "archive" });
useHead({ title: "Results Archive" });

// Filters
const selectedSurfaces = ref(FILTERED_SURFACES);
const selectedMonths = ref(MONTH_NAMES);
const selectedCategories = ref(FILTERED_CATEGORIES);
const selectedYears = ref([new Date().getFullYear().toString()]);

const years = Array.from({ length: new Date().getFullYear() - 1968 + 1 }, (_, index) => (1968 + index).toString());

// API call
const { data: events, status, error } = await useFetch<EventCardType[]>("/api/getArchiveTournaments", { query: { surfaces: selectedSurfaces, months: selectedMonths, categories: selectedCategories, years: selectedYears } });

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
		<u-page-header title="Results Archive" />
		<u-container class="lg:hidden flex flex-col justify-evenly gap-2">
			<year-select
				v-model="selectedYears"
				:items="years"
			/>
			<surface-select v-model="selectedSurfaces" />
			<month-select v-model="selectedMonths" />
			<category-select v-model="selectedCategories" />
		</u-container>
		<u-page-body>
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
				<template #pending>Past events are currently being fetched</template>
				<template #error>No past events available</template>
			</error-message>
		</u-page-body>
		<template #right>
			<u-page-aside>
				<u-container>
					<div>Filters</div>
					<year-select
						v-model="selectedYears"
						:items="years"
					/>
					<surface-select v-model="selectedSurfaces" />
					<month-select v-model="selectedMonths" />
					<category-select v-model="selectedCategories" />
				</u-container>
				<u-page-anchors :links />
			</u-page-aside>
		</template>
	</u-page>
</template>
