<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import { useChangeCase } from "@vueuse/integrations/useChangeCase";
defineProps<{ matches: H2HMatch[] }>();

const columns: TableColumn<H2HMatch>[] = [
	{ accessorKey: "year", header: "Year" },
	{ accessorKey: "winner", header: "Winner" },
	{ accessorKey: "tname", header: "Event" },
	{ accessorKey: "round", header: "Round" },
	{ accessorKey: "surface", header: "Surface" },
	{ id: "score", header: "Score" }
];
</script>

<template>
	<u-table
		:data="matches"
		:columns
	>
		<template #year-cell="{ row }">
			<nuxt-link
				class="hover-link"
				:to="`/tournaments/${useChangeCase(row.original.tname, 'kebabCase').value}/${row.original.tid}/${row.original.year}/${row.original.eid}`"
			>
				{{ row.original.year }}
			</nuxt-link>
		</template>
		<template #winner-cell="{ row }">
			<div class="flex gap-2 items-center">
				<u-avatar
					:src="`https://www.atptour.com/-/media/alias/player-headshot/${row.original.winner}`"
					:alt="row.original.winner_name"
					icon="i-material-symbols-account-circle"
					size="sm"
					class="border border-slate-500"
				/>
				<div>{{ row.original.winner_name }}</div>
			</div>
		</template>
		<template #tname-cell="{ row }">
			<nuxt-link
				class="hover-link"
				:to="`/tournaments/${useChangeCase(row.original.tname, 'kebabCase').value}/${row.original.tid}`"
			>
				{{ row.original.tname }}
			</nuxt-link>
		</template>
		<template #score-cell="{ row }">
			<nuxt-link
				class="hover-link"
				:to="`/tournaments/${useChangeCase(row.original.tname, 'kebabCase').value}/${row.original.tid}/${row.original.year}/${row.original.eid}/${row.original.mid}`"
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
			<u-badge
				v-if="row.original.incomplete"
				:label="row.original.incomplete"
				color="error"
			/>
		</template>
	</u-table>
</template>
