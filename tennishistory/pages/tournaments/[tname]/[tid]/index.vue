<script setup lang="ts">
import { breakpointsTailwind } from "@vueuse/core";
definePageMeta({ name: "tournament" });
const route = useRoute();
const tname = computed(() => route.params.tname);
const tid = computed(() => route.params.tid);
useHead({ title: unencodeName(tname.value) });

const scroll = useScroll();
const breakpoints = useBreakpoints(breakpointsTailwind);
const lgAndUp = breakpoints.greaterOrEqual("lg");

// API call
const { data: tournament, status, error } = await useFetch<TournamentType>("/api/getTournamentDetails", { query: { tid } });

const sidebarLinks = computed(() => {
	if (tournament.value) {
		return tournament.value.events.map((event) => ({
			label: event.year,
			to: `#${event.eid}`
		}));
	}
});
</script>

<template>
	<div class="lg:flex gap-5">
		<sidebar-nav v-show="lgAndUp">
			<template #sidebar-1-header>Tournaments</template>
			<template #sidebar-1-content>
				<shadcn-sidebar-menu>
					<shadcn-sidebar-menu-item
						v-for="link in sidebarLinks"
						:key="link.label"
					>
						<shadcn-sidebar-menu-button>
							<div
								class="hover-link my-2 text-xs"
								role="button"
								:class="{ 'text-emerald-600': scroll.hash.value === link.to }"
								@click="scroll.scroll(link.to)"
							>
								{{ link.label }}
							</div>
						</shadcn-sidebar-menu-button>
					</shadcn-sidebar-menu-item>
				</shadcn-sidebar-menu>
			</template>
		</sidebar-nav>
		<div class="w-full">
			<tournament-breadcrumbs class="my-5" />
			<page-title>
				<template #heading>
					<div class="flex gap-3 items-center">
						<span>{{ unencodeName(tname) }}</span>
						<shadcn-button
							v-if="tournament?.website"
							as-child
							variant="link"
						>
							<nuxt-link
								:href="tournament.website"
								target="_blank"
							>
								<icon
									name="ion:arrow-up-right-box-outline"
									class="text-base text-emerald-600"
								/>
							</nuxt-link>
						</shadcn-button>
					</div>
				</template>
				<template
					#subheading
					v-if="tournament"
				>
					{{ tournament.years }}
				</template>
			</page-title>
			<div
				v-if="tournament && tournament.events.length > 0"
				class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 mt-10"
			>
				<tournament-card
					v-for="event in tournament.events"
					:key="event.eid"
					:event
				/>
			</div>
			<error-message
				v-else
				:status
				error-icon="material-symbols:error-circle-rounded-outline-sharp"
			>
				<template #loading-message>The tournament details are currently being fetched</template>
				<template #error-message>No tournament details available</template>
			</error-message>
		</div>
	</div>
</template>
