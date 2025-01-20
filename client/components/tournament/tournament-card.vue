<script setup lang="ts">
import { useChangeCase } from "@vueuse/integrations/useChangeCase";

const route = useRoute();
const props = defineProps<{ event: TournamentEventType }>();
const { year, winner_country, winner_id, winner_name, loser_country, loser_id, loser_name, eid, match_no } = props.event;
</script>

<template>
	<u-card
		:id="year"
		:ui="{ root: 'flex flex-col ring-violet-800 shadow-violet-600 hover:shadow-md hover:shadow-violet-600', body: 'flex-1', footer: 'flex justify-center mt-auto' }"
	>
		<template #header>{{ year }}</template>
		<u-container class="text-sm">
			<div class="flex items-center gap-2">
				<u-icon
					v-if="winner_country"
					:name="`flag:${COUNTRY_CODES[winner_country]}-4x3`"
				/>
				<u-avatar
					v-if="winner_id && winner_name"
					:src="`https://www.atptour.com/-/media/alias/player-headshot/${winner_id}`"
					:alt="winner_name"
					icon="i-material-symbols-account-circle"
					size="sm"
					class="border border-slate-500"
				/>
				<nuxt-link
					v-if="winner_name && winner_id"
					class="hover-link"
					:to="`/players/${useChangeCase(winner_name, 'kebabCase').value}/${winner_id}/overview`"
				>
					{{ winner_name }}
				</nuxt-link>
			</div>
			<div class="text-center text-xs">d.</div>
			<div>
				<u-icon
					v-if="loser_country"
					:name="`flag:${COUNTRY_CODES[loser_country]}-4x3`"
				/>
				<u-avatar
					v-if="loser_id && loser_name"
					:src="`https://www.atptour.com/-/media/alias/player-headshot/${loser_id}`"
					:alt="loser_name"
					icon="i-material-symbols-account-circle"
					size="sm"
					class="border border-slate-500"
				/>
				<nuxt-link
					v-if="loser_name && loser_id"
					class="hover-link"
					:to="`/players/${useChangeCase(loser_name, 'kebabCase').value}/${loser_id}/overview`"
				>
					{{ loser_name }}
				</nuxt-link>
			</div>
			<div class="text-center">
				<nuxt-link
					class="hover-link"
					:to="`/tournaments/${route.params.name}/${route.params.tid}/${year}/${eid}/${match_no}`"
				>
					<template
						v-for="(_, index) in new Array(5)"
						:key="index"
					>
						<span v-if="(event as any)[`s${index + 1}`]">
							{{ (event as any)[`s${index + 1}`] }}
							<sup v-if="(event as any)[`t${index + 1}`]">
								{{ (event as any)[`t${index + 1}`] }}
							</sup>
						</span>
					</template>
				</nuxt-link>
				<u-badge
					v-if="event.incomplete"
					color="error"
					:label="event.incomplete"
				/>
			</div>
		</u-container>
		<template #footer>
			<u-button-group size="sm">
				<u-button
					v-for="page in EVENT_PAGES"
					:key="page.title"
					:to="`/tournaments/${route.params.name}/${route.params.tid}/${event.year}/${event.eid}/${page.route}`"
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
</template>

<style scoped></style>
