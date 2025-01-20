<script setup lang="ts">
import { useChangeCase } from "@vueuse/integrations/useChangeCase";
const props = defineProps<{ event: EventCardType }>();
const { surface, category, tname, ename, dates, city, country, tid, start, eid, year } = props.event;
</script>

<template>
	<u-card
		:id="eid"
		:ui="{ root: 'flex flex-col ring-violet-800 shadow-violet-600 hover:shadow-md hover:shadow-violet-600', header: 'p-0 sm:px-0', body: 'flex-1', footer: 'flex justify-center mt-auto' }"
	>
		<template #header>
			<div class="relative">
				<nuxt-img
					:src="`/surfaces/${surface}.jpg`"
					:alt="surface"
					loading="lazy"
					class="opacity-75 rounded-t-lg"
				/>
				<category-avatar
					v-if="category"
					:category
					class="absolute top-4 left-4"
				/>
			</div>
		</template>
		<div class="flex flex-col gap-1">
			<div>
				<nuxt-link
					class="hover-link text-lg font-semibold"
					:to="{ name: 'tournament', params: { name: useChangeCase(tname, 'kebabCase').value, tid } }"
				>
					{{ tname }}
				</nuxt-link>
			</div>
			<div
				v-if="ename"
				class="text-sm"
			>
				{{ ename }}
			</div>
			<div class="flex gap-2 items-center">
				<span class="text-slate-400 text-sm">{{ city }}</span>
				<u-icon :name="`flag:${COUNTRY_CODES[country]}-4x3`" />
			</div>
			<div class="text-slate-400 text-sm">{{ dates }}</div>
		</div>
		<template #footer>
			<event-buttons
				:name="tname"
				:tid
				:year
				:eid
			/>
		</template>
	</u-card>
</template>
