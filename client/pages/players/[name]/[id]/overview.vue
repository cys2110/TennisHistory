<script setup lang="ts">
import { useChangeCase } from "@vueuse/integrations/useChangeCase";
definePageMeta({ name: "player" });
const route = useRoute();

const { data: player, status, error } = await useFetch<PlayerDetailsType>("/api/getPlayerDetails", { query: { id: route.params.id } });

useHead({ title: `${player.value?.name ?? useChangeCase(route.params.name as string, "capitalCase").value}` });
</script>

<template>
	<u-page>
		<u-page-header
			headline="Players"
			description="Player Details"
			:links="PLAYER_PAGES"
		>
			<template #title>{{ player?.name ?? useChangeCase(route.params.name as string, "capitalCase").value }}</template>
		</u-page-header>
		<u-page-body>
			<u-page-hero
				v-if="player"
				:title="player.name"
				orientation="horizontal"
				reverse
			>
				<template #description>
					<u-icon :name="`flag:${COUNTRY_CODES[player.country_id]}-4x3`" />
					{{ player.years_active ?? "" }}
					<span v-if="player.active_years">({{ player.active_years }} years)</span>
				</template>
				<nuxt-img
					v-if="player.gladiator"
					:src="`https://www.atptour.com/-/media/alias/player-gladiator-headshot/${route.params.id}`"
					:alt="player.name"
				/>
			</u-page-hero>
			<player-overview
				v-if="player"
				:player
			/>
			<u-alert
				v-else
				variant="subtle"
				:color="status === 'pending' ? 'primary' : 'warning'"
				:icon="status === 'pending' ? 'i-line-md-loading-twotone-loop' : 'i-pepicons-print-person-circle-off'"
				:ui="{ icon: 'size-6', title: 'text-lg', root: 'w-3/4s mx-auto' }"
			>
				<template #title>{{ status === "pending" ? "Player's best results are currently being fetched" : "No results available" }}</template>
			</u-alert>
			<best-results />
		</u-page-body>
	</u-page>
</template>
