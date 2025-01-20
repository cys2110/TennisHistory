<script setup lang="ts">
import { useChangeCase } from "@vueuse/integrations/useChangeCase";

definePageMeta({ name: "draw" });
const route = useRoute();

const { data: results, status, error } = await useFetch<{ name: string; rounds: EventDrawType[] }>("/api/getResults", { query: { eid: route.params.eid } });

useHead({ title: `Draw | ${results.value?.name ?? useChangeCase(route.params.name as string, "capitalCase").value} ${route.params.year}` });
</script>

<template>
	<u-page>
		<u-page-header
			headline="Events"
			description="Draw"
			:links="EVENT_PAGES"
		>
			<template #title>{{ results?.name ?? useChangeCase(route.params.name as string, "capitalCase").value }} {{ route.params.year }}</template>
		</u-page-header>
		<u-page-body>
			<u-alert
				variant="subtle"
				:color="status === 'pending' ? 'primary' : 'warning'"
				:icon="status === 'pending' ? 'i-line-md-loading-twotone-loop' : 'i-pepicons-print-info-circle-off'"
				:ui="{ icon: 'size-6', title: 'text-lg', root: 'w-3/4s mx-auto' }"
			>
				<template #title>{{ status === "pending" ? "Event draw is currently being fetched" : "No draw available" }}</template>
			</u-alert>
		</u-page-body>
	</u-page>
</template>
