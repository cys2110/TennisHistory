<script setup lang="ts">
import { useChangeCase } from "@vueuse/integrations/useChangeCase";
defineProps<{ events: TitlesFinalsType[] }>();
</script>

<template>
	<u-stepper
		:items="events"
		:linear="false"
	>
		<template #indicator="{ item }">{{ item.events.length }}</template>
		<template #content="{ item }">
			<u-page-grid>
				<u-card
					v-for="event in item.events"
					:key="event.eid"
				>
					<template #header>
						<nuxt-link
							class="hover-link"
							:to="`/tournaments/${useChangeCase(event.tname, 'kebabCase').value}/${event.tid}/${item.title}/${event.eid}`"
						>
							{{ event.tname }}
						</nuxt-link>
					</template>
					<div>
						<div>{{ event.date }}</div>
						<div>{{ event.surface }}</div>
					</div>
					<template #footer>
						<u-button-group size="sm">
							<u-button
								v-for="page in EVENT_PAGES"
								:key="page.title"
								:to="`/tournaments/${useChangeCase(event.tname, 'kebabCase').value}/${event.tid}/${item.title}/${event.eid}/${page.route}`"
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
	</u-stepper>
</template>
