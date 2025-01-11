<script setup lang="ts">
import { breakpointsTailwind } from '@vueuse/core'
import { getTournamentDetails } from '@/api/getTournamentDetails'

const breakpoints = useBreakpoints(breakpointsTailwind)
const lgAndUp = breakpoints.greaterOrEqual('lg')
const tname = useRouteParams('name')
const tid = useRouteParams('id')
document.title = `${unencodeName(tname.value as string)} | Tennis History`

interface VenueType {
	name: string
	city: string
	country: string
	years: string
}

interface SponsorNameType {
	name: string
	years: string
}

const tournament = ref<TournamentType | null>(null)
const events = ref<TournamentEventType[]>([])
const sidebarLinks = ref<{ label: string; to: string }[]>([])
const venues: Ref<VenueType[]> = ref([])
const sponsors: Ref<SponsorNameType[]> = ref([])

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
		getTournamentDetails(tid.value as string).then((results: { tournament: TournamentType; events: TournamentEventType[] }) => {
			console.log(results)
			tournament.value = results.tournament
			events.value = results.events

			// Get anchor links
			sidebarLinks.value = results.events.map((event: TournamentEventType) => ({
				label: event.year,
				to: `#event-${event.eid}`
			}))

			// Get venue list
			const venueList: { name: string; city: string; country: string; years: string }[] = []
			results.tournament.venues.forEach((venue) => {
				const first = results.events.find((event) => event.venue === venue.name)
				const last = results.events.findLast((event) => event.venue === venue.name)
				if (first === last) {
					venueList.push({ ...venue, years: `${first?.year}` })
				} else {
					venueList.push({ ...venue, years: `${first?.year} - ${last?.year}` })
				}
			})
			venues.value = venueList

			// Get sponsor name list
			if (results.tournament.names.length > 0) {
				const sponsorList: { name: string; years: string }[] = []
				results.tournament.names.forEach((name) => {
					const first = results.events.find((event) => event.name === name)
					const last = results.events.findLast((event) => event.name === name)
					if (first === last) {
						sponsorList.push({ name: name, years: `${first?.year}` })
					} else {
						sponsorList.push({ name: name, years: `${first?.year} - ${last?.year}` })
					}
				})
				sponsors.value = sponsorList
			}
			return results
		}),
	[],
	{ immediate: true }
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
					<template #icon>
						<a v-if="tournament?.website" :href="tournament.website" target="_blank">
							<font-awesome-icon :icon="['fad', 'link']" />
						</a>
					</template>
					<template #heading>{{ unencodeName(tname as string) }}</template>
					<template #subtitle v-if="tournament">{{ tournament.years }}</template>
				</page-title>
				<el-descriptions direction="vertical" size="small">
					<el-descriptions-item label="Sponsors" class-name="!bg-slate-50 px-3 py-2" label-class-name="!bg-violet-600 px-3 py-2">
						<div v-if="sponsors.length > 0" v-for="name in sponsors" :key="name.name">{{ name.name }} ({{ name.years }})</div>
						<template v-else>—</template>
					</el-descriptions-item>
					<el-descriptions-item label="Venues" class-name="!bg-slate-50 px-3 py-2" label-class-name="!bg-violet-600 px-3 py-2">
						<div v-for="venue in venues" :key="venue.name">
							{{ venue.name }}, {{ venue.city }}
							<flag-icon :country="venue.country" />
							({{ venue.years }})
						</div>
					</el-descriptions-item>
				</el-descriptions>
				<div class="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-5"></div>
				<error-message v-if="error" :icon="['fad', 'calendar-xmark']">
					<template #message>No tournament details available</template>
				</error-message>
			</div>
		</el-main>
		<!-- <el-aside v-if="lgAndUp && sidebarLinks.length > 0" class="h-[calc(100vh - 200px)] sticky">
			<div class="text-lg text-slate-800 dark:text-slate-400 mt-10">Tournaments</div>
			<el-link class="!bg-transparent" @click="scrollToAnchor">
				<el-anchor-link v-for="link in sidebarLinks" :key="link.label" :href="link.to">
					{{ link.label }}
				</el-anchor-link>
			</el-link>
		</el-aside> -->
	</el-container>
</template>

<style scoped>
:deep(.el-descriptions) {
	--el-text-color-regular: theme(colors.slate.400);
	--el-text-color-primary: theme(colors.slate.300);
}
</style>
