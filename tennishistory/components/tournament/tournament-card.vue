<script setup lang="ts">
const props = defineProps<{ event: TournamentEventType }>();
const { eid, loser_country, loser_name, loser_id, winner_country, winner_name, winner_id, year, match_no, ...event } = props.event;
const route = useRoute();
const tname = computed(() => route.params.tname);
const tid = computed(() => route.params.tid);

const eventParams = computed(() => ({
	tname: tname.value,
	tid: tid.value,
	year,
	eid
}));
const matchParams = computed(() => ({ ...eventParams.value, mid: match_no }));
</script>

<template>
	<shadcn-card class="full-card">
		<shadcn-card-header>
			<shadcn-card-title>
				<nuxt-link
					class="hover-link font-bold text-lg"
					:to="{ name: 'event', params: eventParams }"
				>
					{{ year }}
				</nuxt-link>
			</shadcn-card-title>
			<shadcn-separator class="my-2" />
		</shadcn-card-header>
		<shadcn-card-content>
			<div class="mx-auto flex flex-col gap-y-3 justify-start text-sm">
				<div class="flex gap-2 items-center mx-auto">
					<flag-icon
						v-if="winner_country"
						:country="winner_country"
						size="text-lg"
					/>
					<player-avatar
						v-if="winner_id && winner_name"
						:id="winner_id"
						:name="winner_name"
					/>
					<nuxt-link
						class="hover-link ml-1 text-center"
						:to="{ name: 'player', params: { pname: encodeName(winner_name), pid: winner_id } }"
					>
						{{ winner_name }}
					</nuxt-link>
				</div>
				<div class="text-center text-zinc-400">d.</div>
				<div class="flex gap-3 items-center mx-auto">
					<flag-icon
						v-if="loser_country"
						:country="loser_country"
						size="text-lg"
					/>
					<player-avatar
						v-if="loser_id && loser_name"
						:id="loser_id"
						:name="loser_name"
					/>
					<nuxt-link
						class="hover-link ml-1"
						:to="{ name: 'player', params: { pname: encodeName(loser_name), pid: loser_id } }"
					>
						{{ loser_name }}
					</nuxt-link>
				</div>
			</div>
		</shadcn-card-content>
		<shadcn-card-footer class="flex justify-center items-center">
			<nuxt-link
				class="hover-link text-sm flex gap-1"
				:to="{ name: 'match', params: matchParams }"
			>
				<template
					v-for="(_, index) in new Array(5)"
					:key="index"
				>
					<span v-if="(event as any)[`s${index + 1}`]">
						{{ (event as any)[`s${index + 1}`] }}
						<sup v-if="(event as any)[`t${index + 1}`]">{{ (event as any)[`t${index + 1}`] }}</sup>
					</span>
				</template>
			</nuxt-link>
		</shadcn-card-footer>
	</shadcn-card>
</template>
