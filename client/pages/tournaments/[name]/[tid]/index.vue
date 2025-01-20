<script setup lang="ts">
import { useRouteParams } from "@vueuse/router";
import { useChangeCase } from "@vueuse/integrations/useChangeCase";
definePageMeta({ name: "tournament" });
const route = useRoute();
const tname = useRouteParams("name");

// API calls
const { data: tournament, status, error } = await useFetch<TournamentType>("/api/getTournamentDetails", { query: { tid: route.params.tid } });

useHead({ title: tournament.value?.tournament.name ?? useChangeCase(tname.value as string, "capitalCase").value });

// Anchor links
const links = computed(() => {
	if (tournament.value) {
		return tournament.value.events.map(event => ({
			label: event.year,
			to: `#${event.year}`
		}));
	}
});

const websiteLink = computed(() => {
	if (tournament.value?.tournament.website) {
		return [
			{
				icon: "i-ph-arrow-square-up-right-duotone",
				to: tournament.value.tournament.website,
				target: "_blank"
			}
		];
	}
	return [];
});
</script>

<template>
	<u-page>
		<u-page-header
			headline="Tournaments"
			:links="websiteLink"
		>
			<template #title>{{ tournament?.tournament.name ?? useChangeCase(tname as string, "capitalCase").value }}</template>
			<template
				#description
				v-if="tournament?.tournament.years"
			>
				{{ tournament.tournament.years }}
			</template>
		</u-page-header>
		<u-page-body>
			<!--TODO: include names and venues-->
			<u-page-grid v-if="tournament && tournament.events.length > 0">
				<tournament-card
					v-for="event in tournament.events"
					:key="event.eid"
					:event
				/>
			</u-page-grid>
			<error-message
				v-else
				:status
				:error
				icon="i-pepicons-print-calendar-circle-off"
			>
				<template #pending>Details about {{ useChangeCase(tname as string, "capitalCase").value }} are currently being fetched</template>
				<template #error>No details about {{ useChangeCase(tname as string, "capitalCase").value }} available</template>
			</error-message>
		</u-page-body>
		<template #right>
			<u-page-aside>
				<u-page-anchors :links="links" />
			</u-page-aside>
		</template>
	</u-page>
</template>
