<script setup lang="ts">
import { useChangeCase } from "@vueuse/integrations/useChangeCase";
const props = defineProps<{ name: string; tid: string; year: string; eid: string; start?: string }>();

const startDate = props.start ? new Date(props.start) : new Date();
const currentDate = new Date();
const isDisabled = props.start ? currentDate < startDate : false;
</script>

<template>
	<u-tooltip
		:disabled="!isDisabled"
		text="Event has not started yet"
		:ui="{ text: 'text-slate-400' }"
	>
		<u-button-group size="sm">
			<u-button
				v-for="page in EVENT_PAGES"
				:key="page.label"
				:icon="page.icon"
				:to="{ name: page.name, params: { name: useChangeCase(name, 'kebabCase').value, tid, year, eid } }"
				:disabled="isDisabled"
				color="secondary"
				variant="subtle"
				:ui="{ base: 'text-slate-300 shadow-xs shadow-emerald-400 hover:shadow-md hover:shadow-emerald-400' }"
			>
				{{ page.label }}
			</u-button>
		</u-button-group>
	</u-tooltip>
</template>
