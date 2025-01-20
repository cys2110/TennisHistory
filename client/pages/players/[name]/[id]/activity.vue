<script setup lang="ts">
import { useChangeCase } from "@vueuse/integrations/useChangeCase";
definePageMeta({ name: "activity" });
const route = useRoute();
const selectedYear = ref();

const { data: activeYears, status: yearsStatus, error: yearsError } = await useFetch<{ start: { low: number; high: number }; end: { low: number; high: number }; name: string }>("/api/getPlayerActiveYears", { query: { id: route.params.id } });

const { data: stats, status: statsStatus, error: statsError } = await useFetch<{ category: string; value: string }[]>("/api/getPlayerYearStats", { query: { id: route.params.id, year: selectedYear }, immediate: false });

const { data: events, status, error } = await useFetch<PlayerActivityType[]>("/api/getPlayerActivity", { query: { id: route.params.id, year: selectedYear }, immediate: false });

useHead({ title: `Activity | ${activeYears.value?.name ?? useChangeCase(route.params.name as string, "capitalCase").value}` });

watch(
	() => activeYears.value,
	() => {
		selectedYear.value = activeYears.value?.end.low.toString();
	},
	{ immediate: true }
);

const yearsArray = computed(() => {
	if (activeYears.value) {
		const active = activeYears.value;
		return Array.from({ length: active.end.low - active.start.low + 1 }, (_, index) => (active.start.low + index).toString());
	}
	return [];
});

const sidebarLinks = computed(() => {
	if (events.value) {
		return events.value.map(event => ({
			label: event.name,
			to: `#${event.eid}`
		}));
	}
});
</script>

<template>
	<u-page>
		<u-page-header
			headline="Players"
			description="Activity"
			:links="PLAYER_PAGES"
		>
			<template #title>{{ activeYears?.name ?? useChangeCase(route.params.name as string, "capitalCase").value }}</template>
		</u-page-header>
		<u-page-body>
			<u-page-grid v-if="stats">
				<u-page-card
					v-for="stat in stats"
					:key="stat.category"
					:title="stat.category"
					:description="stat.value"
				/>
			</u-page-grid>
			<u-page-list v-if="events">
				<activity-card
					v-for="event in events"
					:key="event.eid"
					:event
					:year="selectedYear"
				/>
			</u-page-list>
			<ClientOnly v-else>
				<u-alert
					variant="subtle"
					:color="status === 'pending' ? 'primary' : 'warning'"
					:icon="status === 'pending' ? 'i-line-md-loading-twotone-loop' : 'i-pepicons-print-calendar-circle-off'"
					:ui="{ icon: 'size-6', title: 'text-lg', root: 'w-3/4s mx-auto' }"
				>
					<template #title>{{ status === "pending" ? "Player activity is currently being fetched" : "No activity available" }}</template>
				</u-alert>
			</ClientOnly>
		</u-page-body>
		<template #right>
			<u-page-aside>
				<u-container>
					<u-select
						v-model="selectedYear"
						:items="yearsArray"
						:loading="yearsStatus === 'pending'"
						class="w-full"
					/>
				</u-container>
				<u-page-anchors :links="sidebarLinks" />
			</u-page-aside>
		</template>
	</u-page>
</template>
