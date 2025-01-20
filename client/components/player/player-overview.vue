<script setup lang="ts">
import { useChangeCase } from "@vueuse/integrations/useChangeCase";

const props = defineProps<{ player: PlayerDetailsType }>();
const { ch, ch_date, wl, titles, pm, age, dob, height, plays, bh, coaches } = props.player;

const statistics = [
	{ title: "Career High", value: ch ?? "—", description: ch_date },
	{ title: "Win-Loss", value: wl },
	{ title: "Titles", value: titles },
	{ title: "Prize Money", value: `$${pm}` },
	{ title: "Age", value: age ? `${age} years` : "—", description: dob },
	{ title: "Height", value: height ? `${height.low} cm (${heightFt(height.low)})` : "—" },
	{ title: "Plays", value: handedness(plays) },
	{ title: "Backhand", value: backhand(bh) }
];
</script>

<template>
	<u-container>
		<u-page-grid class="xl:grid-cols-4">
			<u-page-card
				v-for="stat in statistics"
				:key="stat.title"
				:title="stat.title"
				:description="stat.value"
			>
				<template
					#footer
					v-if="stat.description"
				>
					{{ stat.description }}
				</template>
			</u-page-card>
			<u-page-card :title="coaches.length === 1 ? 'Coach' : 'Coaches'">
				<template #description>
					<div
						v-if="coaches.length > 0"
						v-for="coach in coaches"
						:key="coach.properties.id"
					>
						<nuxt-link
							v-if="coach.properties.first_name && coach.properties.last_name"
							class="hover-link"
							:to="`/players/${useChangeCase(coach.properties.first_name, 'kebabCase').value}-${useChangeCase(coach.properties.last_name, 'kebabCase').value}/${coach.properties.id}/overview`"
						>
							{{ coach.properties.first_name }} {{ coach.properties.last_name }}
						</nuxt-link>
						<template v-else>{{ coach.properties.id }}</template>
					</div>
					<template v-else>—</template>
				</template>
			</u-page-card>
			<u-page-card
				class="col-span-2"
				title="Previous Representations"
			>
				<template #description>
					<div
						v-if="player.countries.length > 0"
						v-for="country in player.countries"
						:key="country.id"
					>
						<u-icon :name="`flag:${country.id}-4x3`" />
						<span>{{ country.name }}</span>
						<span>{{ country.dates }}</span>
					</div>
					<template v-else>—</template>
				</template>
			</u-page-card>
		</u-page-grid>
	</u-container>
</template>
