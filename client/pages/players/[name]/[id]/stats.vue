<script setup lang="ts">
import { useChangeCase } from "@vueuse/integrations/useChangeCase";
definePageMeta({ name: "stats" });
const route = useRoute();
const checked = ref(false);

const selectedYears: Ref<string[]> = ref([]);
const selectedSurfaces = ref(FILTERED_SURFACES);

const { data: activeYears, status: yearStatus, error: yearsError } = await useFetch<{ start: { low: number; high: number }; end: { low: number; high: number }; name: string }>("/api/getPlayerActiveYears", { query: { id: route.params.id } });

const { data: stats, status, error } = await useFetch<PlayerStatsType[]>("/api/getPlayerStats", { query: { id: route.params.id, years: selectedYears, surfaces: selectedSurfaces }, immediate: false });

watch(
	() => activeYears.value,
	() => {
		if (activeYears.value) {
			const active = activeYears.value;
			selectedYears.value = Array.from({ length: active.end.low - active.start.low + 1 }, (_, index) => (active.start.low + index).toString());
		}
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

useHead({ title: `Stats | ${activeYears.value?.name ?? useChangeCase(route.params.name as string, "capitalCase").value}` });
</script>

<template>
	<u-page>
		<u-page-header
			headline="Players"
			description="Stats"
			:links="PLAYER_PAGES"
		>
			<template #title>{{ activeYears?.name ?? useChangeCase(route.params.name as string, "capitalCase").value }}</template>
		</u-page-header>
		<u-page-body>
			<u-switch
				v-model="checked"
				checked-icon="i-material-symbols-bar-chart-4-bars-rounded"
				unchecked-icon="i-ph-table-duotone"
			/>
			<u-container v-if="stats">
				<player-stats-table
					v-if="!checked"
					:stats
				/>
				<player-stats-chart
					v-else
					:stats
				/>
			</u-container>
			<u-alert
				v-else
				variant="subtle"
				:color="status === 'pending' ? 'primary' : 'warning'"
				:icon="status === 'pending' ? 'i-line-md-loading-twotone-loop' : 'i-material-symbols-bar-chart-off-rounded'"
				:ui="{ icon: 'size-6', title: 'text-lg', root: 'w-3/4s mx-auto' }"
			>
				<template #title>{{ status === "pending" ? "Player stats are currently being fetched" : "No stats available" }}</template>
			</u-alert>
		</u-page-body>
		<template #right>
			<u-page-aside>
				<u-container>
					<u-select
						v-model="selectedYears"
						:items="yearsArray"
						:loading="yearStatus === 'pending'"
						multiple
						icon="i-material-symbols-calendar-today-rounded"
						class="w-full"
					/>
					<u-select
						v-model="selectedSurfaces"
						:items="FILTERED_SURFACES"
						multiple
						icon="i-game-icons-tennis-court"
						class="w-full"
					/>
				</u-container>
			</u-page-aside>
		</template>
	</u-page>
</template>
