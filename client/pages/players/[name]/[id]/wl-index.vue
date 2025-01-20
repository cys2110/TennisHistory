<script setup lang="ts">
import { useChangeCase } from "@vueuse/integrations/useChangeCase";
definePageMeta({ name: "wl-index" });
const route = useRoute();
const checked = ref(false);

const { data: wlIndex, status, error } = await useFetch<{ name: string; index: PlayerWLIndexType[] }>("/api/getWLIndex", { query: { id: route.params.id } });

useHead({ title: `WL Index | ${wlIndex.value?.name ?? useChangeCase(route.params.name as string, "capitalCase").value}` });

const index = computed(() => {
	if (wlIndex.value) {
		const formattedIndex = wlIndex.value.index.map(indice => ({
			...indice,
			wins: indice.wins,
			losses: indice.losses,
			titles: indice.titles || null,
			value: indice.wins === "0" && indice.losses === "0" ? 0 : parseFloat((parseInt(indice.wins) / (parseInt(indice.wins) + parseInt(indice.losses))).toFixed(3))
		}));
		return formattedIndex;
	}
});
</script>

<template>
	<u-page>
		<u-page-header
			headline="Players"
			description="Win-Loss Index"
			:links="PLAYER_PAGES"
		>
			<template #title>{{ wlIndex?.name ?? useChangeCase(route.params.name as string, "capitalCase").value }}</template>
		</u-page-header>
		<u-page-body>
			<u-switch
				v-model="checked"
				checked-icon="i-ic-baseline-auto-graph"
				unchecked-icon="i-material-symbols-table-chart"
			/>
			<u-container v-if="index">
				<wlindex-table
					v-if="!checked"
					:index
				/>
				<wlindex-chart
					v-else
					:index
				/>
			</u-container>
			<u-alert
				v-else
				variant="subtle"
				:color="status === 'pending' ? 'primary' : 'warning'"
				:icon="status === 'pending' ? 'i-line-md-loading-twotone-loop' : 'i-material-symbols-bar-chart-off-rounded'"
				:ui="{ icon: 'size-6', title: 'text-lg', root: 'w-3/4s mx-auto' }"
			>
				<template #title>{{ status === "pending" ? "Player's best results are currently being fetched" : "No results available" }}</template>
			</u-alert>
		</u-page-body>
	</u-page>
</template>
