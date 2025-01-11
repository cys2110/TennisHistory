<script setup lang="ts">
import { breakpointsTailwind } from '@vueuse/core'
import { getArchiveTournaments } from '@/api/getArchiveTournaments'

const breakpoints = useBreakpoints(breakpointsTailwind)
const lgAndUp = breakpoints.greaterOrEqual('lg')
document.title = 'Results Archive | TennisHistory'

const events = ref<EventCardType[]>([])
const sidebarLinks = ref<{ label: string; to: string }[]>([])

// Year filter
const year = ref([new Date().getFullYear().toString()])
const years = Array.from({ length: 2025 - 1968 + 1 }, (_, index) => ({ label: 1968 + index, value: 1968 + index }))

// Surface filter
const surface = ref(['Clay', 'Grass', 'Hard'])
const surfaces = [
	{ label: 'Clay', value: 'Clay' },
	{ label: 'Grass', value: 'Grass' },
	{ label: 'Hard', value: 'Hard' }
]

// Month filter
const month = ref(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'])
const monthsOptions = MONTHS.map((month, index) => ({ label: month, value: (index + 1).toString() }))

// Category filter
const category = ref(['ATP 250', 'ATP 500', 'ATP Masters 1000', 'Grand Slam', 'ATP Finals'])
const categoryOptions = [
	{ label: 'ATP 250', value: 'ATP 250' },
	{ label: 'ATP 500', value: 'ATP 500' },
	{ label: 'ATP Masters 1000', value: 'ATP Masters 1000' },
	{ label: 'Grand Slam', value: 'Grand Slam' },
	{ label: 'ATP Finals', value: 'ATP Finals' }
]

// Use vue router for smooth scolling to anchor
const scrollToAnchor = (event: MouseEvent) => {
	event.preventDefault()
	const target = event.target as HTMLAnchorElement
	const id = target.getAttribute('href')?.slice(1)
	let element
	if (id) element = document.getElementById(id)
	if (element) element.scrollIntoView({ behavior: 'smooth' })
}

const { error, isLoading, execute } = useAsyncState(
	() =>
		getArchiveTournaments(surface.value, month.value, category.value, year.value).then((results) => {
			events.value = results
			sidebarLinks.value = results.map((event: EventCardType) => ({
				label: event.tname,
				to: `#event-${event.eid}`
			}))
			return results
		}),
	[],
	{ immediate: true }
)

watch(
	() => [surface.value, month.value, category.value, year.value],
	() => execute()
)
</script>

<template>
	<el-container class="h-screen">
		<el-main class="scroll">
			<div class="w-5/6 mx-auto">
				<el-backtop :right="50" :bottom="50" target=".scroll">
					<font-awesome-icon :icon="['fad', 'up']" class="text-slate-300" />
				</el-backtop>
				<page-title>
					<template #heading>Results Archive</template>
					<div v-if="!lgAndUp" class="flex gap-3 my-3">
						<select-component label="Year" :options="years" v-model="year" />
						<select-component label="Category" :options="categoryOptions" v-model="category" />
						<select-component label="Month" :options="monthsOptions" v-model="month" />
						<select-component label="Surface" :options="surfaces" v-model="surface" />
					</div>
				</page-title>
				<div class="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-5">
					<loading-event-card v-if="isLoading" v-for="i in new Array(3)" :key="i" />
					<event-card v-else-if="events.length > 0" v-for="event in events" :key="event.eid" :event />
				</div>
				<error-message v-if="(error || events.length === 0) && !isLoading" :icon="['fad', 'calendar-xmark']">
					<template #message>No events available</template>
				</error-message>
			</div>
		</el-main>
		<el-aside v-if="lgAndUp" class="h-[calc(100vh - 200px)] sticky">
			<div class="mt-24 flex flex-col gap-3">
				<div class="text-lg text-slate-800 dark:text-slate-400">Filters</div>
				<select-component label="Year" :options="years" v-model="year" />
				<select-component label="Category" :options="categoryOptions" v-model="category" />
				<select-component label="Month" :options="monthsOptions" v-model="month" />
				<select-component label="Surface" :options="surfaces" v-model="surface" />
			</div>
			<div class="text-lg text-slate-800 dark:text-slate-400 mt-10">On this page</div>
			<div class="!h-96 overflow-y-auto my-5 anchor-container">
				<el-anchor v-if="sidebarLinks.length > 0" class="!bg-transparent" @click="scrollToAnchor">
					<el-anchor-link v-for="link in sidebarLinks" :key="link.label" :href="link.to">{{ link.label }}</el-anchor-link>
				</el-anchor>
			</div>
		</el-aside>
	</el-container>
</template>
