<script setup lang="ts">
import { useChangeCase } from "@vueuse/integrations/useChangeCase";

const props = defineProps<{ id: string; title: string; description: string }>();

const { data: matches, status, error } = await useFetch("/api/getUmpireResults", { query: { id: props.id } });
</script>

<template>
	<u-model
		:title
		:description
	>
		<template #body>
			<u-page-grid v-if="matches">
				<u-card
					v-for="event in matches"
					:key="event.eid"
				>
					<template #header>{{ event.tname }} {{ event.year }}</template>
					<u-page-list>
						<div
							v-for="round in event.rounds"
							:key="round.round"
						>
							<div>{{ round.round }}</div>
							<u-page-grid>
								<u-page-feature
									v-for="match in round.matches"
									:key="match.match_no"
									:title="`${match.p1} v. ${match.p2}`"
									:to="`/tournaments/${useChangeCase(event.tname, 'kebabCase').value}/${event.tid}/${event.year}/${event.eid}/${match.match_no}`"
								/>
							</u-page-grid>
						</div>
					</u-page-list>
					<template #footer>
						<u-button-group size="sm">
							<u-button
								v-for="page in EVENT_PAGES"
								:key="page.title"
								:to="`/tournaments/${useChangeCase(event.tname, 'kebabCase').value}/${event.tid}/${event.year}/${event.eid}/${page.route}`"
								:icon="page.icon"
								color="secondary"
								variant="subtle"
								:ui="{ base: 'text-slate-300 shadow-xs shadow-emerald-400 hover:shadow-md hover:shadow-emerald-400' }"
							>
								{{ page.title }}
							</u-button>
						</u-button-group>
					</template>
				</u-card>
			</u-page-grid>
		</template>
	</u-model>
</template>

<style scoped></style>
