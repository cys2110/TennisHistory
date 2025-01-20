<script setup lang="ts">
import { useChangeCase } from "@vueuse/integrations/useChangeCase";
const route = useRoute();

const { data: h2h, status, error } = await useFetch<H2H>("/api/getH2H", { query: { p1Id: route.params.p1Id, p2Id: route.params.p2Id } });

useHead({ title: `H2H | ${h2h.value?.p1.name ?? useChangeCase(route.params.p1Name as string, "capitalCase").value} vs. ${h2h.value?.p2.name ?? useChangeCase(route.params.p2Name as string, "capitalCase").value}` });

const links = computed(() => {
	if (h2h.value) {
		return [
			{ label: h2h.value.p1.name, to: `/players/${route.params.p1Name}/${route.params.p1Id}/overview` },
			{ label: h2h.value.p2.name, to: `/players/${route.params.p2Name}/${route.params.p2Id}/overview` }
		];
	}
});

const winLoss = computed(() => {
	if (h2h.value) {
		const totalMatches = h2h.value.matches.length;
		const p1Wins = h2h.value.matches.filter(match => match.winner === route.params.p1Id).length;
		return [p1Wins, totalMatches - p1Wins];
	}
	return [0, 0];
});
</script>

<template>
	<u-page>
		<u-page-header :links>
			<template #title>{{ h2h?.p1.name ?? useChangeCase(route.params.p1Name as string, "capitalCase").value }} v. {{ h2h?.p2.name ?? useChangeCase(route.params.p2Name as string, "kebabCase").value }}</template>
		</u-page-header>
		<u-page-body>
			<template v-if="h2h">
				<u-page-columns>
					<h2h-player-card
						:player="h2h.p1"
						:index="1"
					/>
					<div>
						<h2h-doughnut-chart :win-loss />
						<h2h-table :h2h />
					</div>
					<h2h-player-card
						:player="h2h.p2"
						:index="2"
					/>
				</u-page-columns>
				<h2h-match-table :matches="h2h.matches" />
			</template>
			<u-alert
				v-else
				variant="subtle"
				:color="status === 'pending' ? 'primary' : 'warning'"
				:icon="status === 'pending' ? 'i-line-md-loading-twotone-loop' : 'i-pepicons-print-swords-circle-off'"
				:ui="{ icon: 'size-6', title: 'text-lg', root: 'w-3/4s mx-auto' }"
			>
				<template #title>{{ status === "pending" ? "Head to head is currently being fetched" : "No head to head available" }}</template>
			</u-alert>
		</u-page-body>
	</u-page>
</template>
