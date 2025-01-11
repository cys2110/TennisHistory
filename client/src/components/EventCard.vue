<script setup lang="ts">
const props = defineProps<{ event: EventCardType }>()
const { tname, ename, start, tid, year, eid, category, city, dates, surface, country } = props.event

// Disabled buttons if event has not started yet
const startDate = new Date(start)
const currentDate = new Date()
const isDisabled = currentDate < startDate
</script>

<template>
	<el-card :id="`event-${eid}`" class="!bg-transparent !border-2 !border-violet-600 !shadow-md !shadow-violet-500 hover:!shadow-lg hover:!shadow-violet-500 !rounded-xl">
		<template #header>
			<div class="flex items-center gap-3 h-16">
				<el-avatar :src="`/category/${category}.svg`" :alt="category ?? 'category'" fit="fill" class="bg-slate-100/50 dark:bg-slate-400/50 border border-slate-400/50">
					<image src="/tennis-court.svg" />
				</el-avatar>
				<router-link :to="{ name: 'tournament', params: { name: encodeName(tname), id: tid } }">{{ tname }}</router-link>
			</div>
			<el-divider class="!border-slate-500">
				<div v-if="ename" class="text-slate-500 text-xs text-center !bg-slate-200 dark:!bg-slate-950">{{ ename }}</div>
			</el-divider>
		</template>
		<div class="!text-slate-700 dark:!text-slate-300 text-sm">
			<div v-if="city" class="text-center md:text-left flex items-center gap-2">
				<span>{{ city }}</span>
				<span>
					<flag-icon :country />
				</span>
			</div>
			<div class="text-center md:text-left">{{ dates }}</div>
			<div v-if="surface" class="text-center md:text-left">
				{{ surface }}
			</div>
		</div>
		<template #footer>
			<div class="flex justify-evenly items-center">
				<el-tooltip v-for="page in EVENT_PAGES" :key="page.name" :disabled="!isDisabled" content="Event has not started yet" effect="customised">
					<el-button round class="!bg-transparent !text-slate-400 hover:!text-slate-300 !border-emerald-600 shadow-sm shadow-emerald-500 hover:shadow-md hover:shadow-emerald-500" :disabled="isDisabled" size="small" tag="router-link" :to="{ name: page.name, params: { name: encodeName(tname), id: tid, year, eid } }">
						<template #icon>
							<font-awesome-icon :icon="page.icon" />
						</template>
						{{ page.title }}
					</el-button>
				</el-tooltip>
			</div>
		</template>
	</el-card>
</template>

<style>
.el-card {
	@apply flex flex-col;
}

.el-card__header {
	@apply !border-none !px-3 !py-1;
}

.el-divider__text {
	@apply p-0;
}

.el-card__body {
	@apply flex-1 !px-5 !py-1;
}

.el-card__footer {
	@apply !border-none !py-3;
}

.el-popper.is-customised {
	@apply text-slate-400 bg-slate-950;
}
</style>
