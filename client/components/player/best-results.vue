<script setup lang="ts">
import { useChangeCase } from "@vueuse/integrations/useChangeCase";

const route = useRoute();

const { data: results, status, error } = await useFetch<PlayerBestResultsType[]>("/api/getPlayerBestResults", { query: { id: route.params.id } });
</script>

<template>
	<u-page-section title="Best Results">
		<template
			#features
			v-if="results"
		>
			<u-page-feature
				v-for="result in results"
				:key="result.tid"
			>
				<template #title>
					<nuxt-link
						class="hover-link"
						:to="`/tournaments/${useChangeCase(result.tname, 'kebabCase').value}/${result.tid}`"
					>
						{{ result.tname }}
					</nuxt-link>
					— {{ result.round }}
				</template>
				<template #description>
					<div
						v-for="event in result.events"
						:key="event.year"
					>
						<nuxt-link
							class="hover-link"
							:to="`/tournaments/${useChangeCase(result.tname, 'kebabCase').value}/${result.tid}/${event.year}/${event.eid}`"
						>
							{{ event.year }}
						</nuxt-link>
					</div>
				</template>
			</u-page-feature>
		</template>
		<template
			#description
			v-else
		>
			<u-alert
				variant="subtle"
				:color="status === 'pending' ? 'primary' : 'warning'"
				:icon="status === 'pending' ? 'i-line-md-loading-twotone-loop' : 'i-pepicons-print-trophy-circle-off'"
				:ui="{ icon: 'size-6', title: 'text-lg', root: 'w-3/4s mx-auto' }"
			>
				<template #title>{{ status === "pending" ? "Player's best results are currently being fetched" : "No results available" }}</template>
			</u-alert>
		</template>
	</u-page-section>
</template>
