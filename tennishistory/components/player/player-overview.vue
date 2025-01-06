<script setup lang="ts">
import { convert } from "convert";
import { breakpointsTailwind } from "@vueuse/core";
const breakpoints = useBreakpoints(breakpointsTailwind);

const emits = defineEmits<{ (e: "update:showMessage", value: string | boolean): void }>();
const route = useRoute();
const pname = computed(() => route.params.pname);
const pid = computed(() => route.params.pid);
const largeScreenUp = breakpoints.greaterOrEqual("lg");

const handleResponse = ({ response }: { response: Response }) => {
	if (response.status === 204) emits("update:showMessage", "success");
};

const handleError = ({ error }: { error: any }) => {
	if (error) emits("update:showMessage", "error");
};

// API call
const {
	data: player,
	status,
	error
} = await useFetch<PlayerDetailsType>("/api/getPlayerDetails", {
	query: { pid },
	onResponse: handleResponse,
	onResponseError: handleError
});

watch(status, (newStatus) => {
	if (newStatus === "pending") {
		emits("update:showMessage", "pending");
	} else if (newStatus === "success") {
		emits("update:showMessage", false);
	} else {
		emits("update:showMessage", "error");
	}
});

const statistics = computed(() => {
	if (player.value) {
		return [
			{ title: "Career High", value: player.value.ch ?? "—", description: player.value.ch_date },
			{ title: "Win-Loss", value: player.value.wl },
			{ title: "Titles", value: player.value.titles },
			{ title: "Prize Money", prefix: "$", value: player.value.pm }
		];
	}
	return [];
});

const height_ft = computed(() => {
	if (player.value?.height) {
		const ftDecimal = convert(player.value.height.low, "cm").to("ft");
		const ft = Math.floor(ftDecimal);
		const inches = Math.round((ftDecimal - ft) * 12);
		return `${ft}'${inches}"`;
	}
	return "—";
});

const fieldsetItems = [
	{ legend: "Active", value: player.value?.active_years ? `${player.value.active_years} years` : "—", description: player.value?.years_active },
	{ legend: "Age", value: player.value?.age ?? "—", description: player.value?.dob },
	{ legend: "Height", value: player.value?.height ? `${player.value.height.low} cm` : "—", description: player.value?.height ? height_ft : null },
	{ legend: "Plays", value: player.value ? handedness(player.value.plays) : "—" },
	{ legend: "Backhand", value: player.value ? bh(player.value.bh) : "—" }
];
</script>

<template>
	<div
		v-if="player"
		class="flex flex-col lg:flex-row gap-5"
	>
		<div class="my-3 mx-auto max-w-56">
			<ClientOnly>
				<nuxt-img
					v-if="player.gladiator && largeScreenUp"
					:src="`https://www.atptour.com/-/media/alias/player-gladiator-headshot/${pid}`"
					:alt="pname as string"
				/>
				<player-avatar
					v-else
					:pid="pid as string"
					:pname="pname as string"
				/>
			</ClientOnly>
		</div>
		<div class="col-span-5 lg:col-span-4 w-fit mx-auto">
			<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 justify-center">
				<shadcn-card
					v-for="stat in statistics"
					:key="stat.title"
					class="p-5 w-full mx-auto text-center full-card border-emerald-600 shadow-emerald-800 hover:shadow-emerald-800 dark:border-emerald-600 dark:shadow-emerald-400 dark:hover:shadow-emerald-400 dark:bg-surface-900"
				>
					<shadcn-card-header>
						<shadcn-card-title class="text-zinc-500 dark:text-zinc-300"> {{ stat.prefix || "" }} {{ stat.value }} </shadcn-card-title>
						<shadcn-card-description class="flex flex-col">
							<span>{{ stat.title }}</span>
							<span v-if="stat.description">{{ stat.description }}</span>
						</shadcn-card-description>
					</shadcn-card-header>
				</shadcn-card>
			</div>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5 mt-5">
				<prime-fieldset
					legend="Country"
					class="flex items-center justify-center"
				>
					<div class="flex items-center justify-center gap-2">
						<Icon
							v-if="getCountryCode(player.country_id)"
							:name="`flag:${getCountryCode(player.country_id)}-4x3`"
							:alt="player.country_name"
							class="text-lg border border-zinc-400 rounded"
						/>
						<component
							v-else
							:is="`Icons${player.country_id}`"
						/>
						<span>{{ player.country_name }}</span>
					</div>
				</prime-fieldset>
				<prime-fieldset
					v-for="item in fieldsetItems"
					:key="item.legend"
					:legend="item.legend"
					class="flex items-center justify-center"
				>
					<div class="text-center">{{ item.value }}</div>
					<div
						v-if="item.description"
						class="text-center"
					>
						{{ item.description }}
					</div>
				</prime-fieldset>
				<prime-fieldset
					class="col-span-2 flex items-center justify-center"
					legend="Previous Representations"
				>
					<div
						v-if="player.countries.length > 0"
						v-for="country in player.countries"
						:key="country.id"
						class="grid grid-cols-5 gap-1 text-sm"
					>
						<div>
							<Icon
								v-if="getCountryCode(country.id)"
								:name="`flag:${getCountryCode(country.id)}-4x3`"
								:alt="country.name"
								class="text-lg border border-zinc-400 rounded"
							/>
							<component
								v-else
								:is="`Icons${country.id}`"
							/>
						</div>
						<div class="col-span-2">{{ country.name }}</div>
						<div class="col-span-2">{{ country.dates }}</div>
					</div>
					<div v-else>—</div>
				</prime-fieldset>
				<prime-fieldset
					:legend="player.coaches.length === 1 ? 'Coach' : 'Coaches'"
					class="flex items-center justify-center"
				>
					<div
						v-if="player.coaches.length > 0"
						v-for="coach in player.coaches"
						:key="coach.properties.id"
					>
						<nuxt-link
							v-if="coach.labels.includes('Player')"
							class="hover-link"
							:to="`/players/${encodeName(coach.properties.first_name)}_${encodeName(coach.properties.last_name)}/${coach.properties.id}`"
						>
							{{ coach.properties.first_name }} {{ coach.properties.last_name }}</nuxt-link
						>
						<template v-else>{{ coach.properties.id }}</template>
					</div>
					<div v-else>—</div>
				</prime-fieldset>
			</div>
		</div>
	</div>
</template>

<style scoped>
:deep(span img) {
	@apply !w-1/2 !h-1/2 border border-zinc-400 mx-auto my-5;
}
</style>
