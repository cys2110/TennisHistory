<script setup lang="ts">
import { useChangeCase } from "@vueuse/integrations/useChangeCase";
const props = defineProps<{ type: string; id: string; title: string; description: string }>();

const apiRoute = computed(() => {
	switch (props.type) {
		case "coaches":
			return "/api/getCoachResults";
		default:
			return "/api/getCountryResults";
	}
});

const { data: players, status, error } = await useFetch(apiRoute.value, { query: { id: props.id }, timeout: 300 });

const selectedArray = computed(() => {
	if (players.value) {
		switch (props.type) {
			case "countries":
				return players.value.players;
			case "coaches":
				return players.value;
			default:
				return null;
		}
	}
	return null;
});
</script>

<template>
	<u-modal
		:title
		:description
	>
		<template #body>
			<u-page-grid v-if="selectedArray">
				<div
					v-if="type === 'countries'"
					class="col-span-3"
				>
					Current/Retired Players
				</div>
				<u-page-card
					v-for="player in selectedArray"
					:key="player.id"
					:to="`/players/${useChangeCase(player.name, 'kebabCase').value}/${player.id}/overview`"
					:title="player.name"
					:icon="`flag:${COUNTRY_CODES[player.country as keyof typeof COUNTRY_CODES]}-4x3`"
					orientation="horizontal"
				>
					<u-avatar
						:src="`https://www.atptour.com/-/media/alias/player-headshot/${player.id}`"
						:alt="player.name"
						icon="i-material-symbols-account-circle"
						size="sm"
						class="border border-slate-500"
					/>
				</u-page-card>
				<div
					v-if="type === 'countries'"
					class="col-span-3"
				>
					Former players
				</div>
				<u-page-card
					v-if="type === 'countries'"
					v-for="player in players.former"
					:key="player.id"
					:to="`/players/${useChangeCase(player.name, 'kebabCase').value}/${player.id}/overview`"
					:title="player.name"
					orientation="horizontal"
				>
					<u-avatar
						:src="`https://www.atptour.com/-/media/alias/player-headshot/${player.id}`"
						:alt="player.name"
						icon="i-material-symbols-account-circle"
						size="sm"
						class="border border-slate-500"
					/>
				</u-page-card>
			</u-page-grid>
			<div v-else-if="error">{{ error }}</div>
		</template>
	</u-modal>
</template>

<style scoped></style>
