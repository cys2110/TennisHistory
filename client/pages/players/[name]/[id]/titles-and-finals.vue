<script setup lang="ts">
import { useChangeCase } from "@vueuse/integrations/useChangeCase";

const route = useRoute();
definePageMeta({ name: "titles" });
const checked = ref(false);

const { data: results, status, error } = await useFetch<{ name: string } & Record<"titles" | "finals", TitlesFinalsType[]>>(`/api/getTitlesAndFinals`, { query: { id: route.params.id } });

useHead({ title: `Titles and Finals | ${results.value?.name ?? useChangeCase(route.params.name as string, "capitalCase").value}` });
</script>

<template>
	<u-page>
		<u-page-header
			headline="Players"
			description="Titles and Finals"
			:links="PLAYER_PAGES"
		>
			<template #title>{{ results?.name ?? useChangeCase(route.params.name as string, "capitalCase").value }}</template>
		</u-page-header>
		<u-page-body>
			<u-switch
				v-model="checked"
				checked-icon="i-pepicons-print-trophy-circle-off"
				unchecked-icon="i-pepicons-print-trophy-circle"
			>
				<template #label>{{ checked ? "Finals" : "Titles" }}</template>
			</u-switch>
			<titles-stepper
				v-if="results"
				:events="checked ? results?.finals : results?.titles"
			/>
			<u-alert
				v-else
				variant="subtle"
				:color="status === 'pending' ? 'primary' : 'warning'"
				:icon="status === 'pending' ? 'i-line-md-loading-twotone-loop' : 'i-pepicons-print-trophy-circle-off'"
				:ui="{ icon: 'size-6', title: 'text-lg', root: 'w-3/4s mx-auto' }"
			>
				<template #title>{{ status === "pending" ? "Results are currently being fetched" : "No results available" }}</template>
			</u-alert>
		</u-page-body>
	</u-page>
</template>
