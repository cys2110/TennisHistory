<script setup lang="ts">
import { useChangeCase } from "@vueuse/integrations/useChangeCase";
import type { TableColumn } from "@nuxt/ui";

const route = useRoute();
defineProps<{ event: PlayerActivityType; year: string }>();

const columns: TableColumn<ActivityMatchType>[] = [{ accessorKey: "round", header: "Round" }, { accessorKey: "country", header: "" }, { accessorKey: "id", header: "" }, { accessorKey: "name", header: "Opponent" }, { accessorKey: "rank", header: "Rank" }, { accessorKey: "winner", header: "" }, { id: "score", header: "Score" }, { id: "h2h" }];
</script>

<template>
	<div>
		<u-table
			:data="event.matches"
			:columns
		>
			<template #country-cell="{ row }">
				<u-icon :name="`flag:${COUNTRY_CODES[row.original.country as keyof typeof COUNTRY_CODES]}-4x3`" />
			</template>
			<template #id-cell="{ row }">
				<u-avatar
					:src="`https://www.atptour.com/-/media/alias/player-headshot/${row.original.id}`"
					class="border border-slate-400"
				/>
			</template>
			<template #name-cell="{ row }">
				<div v-if="row.original.incomplete === 'B'">BYE</div>
				<div v-else-if="row.original.name">
					<nuxt-link
						class="hover-link"
						:to="`/players/${useChangeCase(row.original.name, 'kebabCase').value}/${row.original.id}/overview`"
					>
						{{ row.original.name }}
					</nuxt-link>
					<small v-if="row.original.seed || row.original.status">({{ row.original.seed }}{{ row.original.status }})</small>
				</div>
			</template>
			<template #winner-cell="{ row }">
				<u-icon
					:name="row.original.winner !== row.original.id ? 'i-ph-check-circle-duotone' : 'i-ph-x-circle-duotone'"
					class="text-xl"
					:class="row.original.winner !== row.original.id ? 'text-green-600' : 'text-red-600'"
				/>
			</template>
			<template #score-cell="{ row }">
				<nuxt-link
					class="hover-link"
					:to="`/tournaments/${useChangeCase(event.name, 'kebabCase').value}/${event.tid}/${year}/${event.eid}/${row.original.match_no}`"
				>
					<template
						v-for="(_, index) in new Array(5)"
						:key="index"
					>
						<span v-if="(row.original as any)[`s${index + 1}`]">
							{{ (row.original as any)[`s${index + 1}`] }}
							<sup v-if="(row.original as any)[`t${index + 1}`]">
								{{ (row.original as any)[`t${index + 1}`] }}
							</sup>
						</span>
					</template>
				</nuxt-link>
			</template>
			<template #h2h-cell="{ row }">
				<u-button
					v-if="row.original.name"
					size="sm"
					:to="`/h2h/${route.params.name}-v-${useChangeCase(row.original.name, 'kebabCase').value}/${route.params.id}-${row.original.id}`"
				>
					H2H
				</u-button>
			</template>
		</u-table>
	</div>
</template>

<style scoped></style>
