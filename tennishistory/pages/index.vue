<script setup lang="ts">
import { breakpointsTailwind } from "@vueuse/core";
definePageMeta({ name: "home" });
useHead({ title: "Upcoming Tournaments" });

const scroll = useScroll();
const breakpoints = useBreakpoints(breakpointsTailwind);
const lgAndUp = breakpoints.greaterOrEqual("lg");

// Filters
const baseOption = { label: "All", value: "All" };

// Surface filter
const surface = ref("All");
const surfaces = [baseOption, { label: "Clay", value: "Clay" }, { label: "Grass", value: "Grass" }, { label: "Hard", value: "Hard" }];

// Month filter
const month = ref("All");
const baseMonths = MONTHS.map((month, index) => ({ label: month, value: index + 1 }));
const months = [baseOption, ...baseMonths];

// Category filter
const category = ref("All");
const baseCategories = CATEGORIES.map((category) => ({ label: category, value: category }));
const categories = [baseOption, ...baseCategories];

const selectOptions = [
	{ vModel: category, options: categories, label: "Category" },
	{ vModel: month, options: months, label: "Month" },
	{ vModel: surface, options: surfaces, label: "Surface" }
];

// API call to get upcoming tournaments
const { data: events, status, error } = await useFetch<EventCardType[]>("/api/getUpcomingTournaments", { query: { category, month, surface } });

const sidebarLinks = computed(() => {
	if (events.value) {
		return events.value.map((event) => ({
			label: event.tname,
			to: `#${event.eid}`
		}));
	}
});
</script>

<template>
	<div class="lg:flex gap-5">
		<sidebar-nav v-show="lgAndUp">
			<template #sidebar-1-header>Filters</template>
			<template #sidebar-1-content>
				<prime-float-label
					v-for="(select, index) in selectOptions"
					:key="select.label"
					class="w-fit min-w-24 my-3"
					variant="on"
				>
					<prime-select
						:inputId="`select-${index}`"
						v-model="select.vModel"
						:options="select.options"
						option-label="label"
						option-value="value"
						class="w-full"
						size="small"
					>
						<template #dropdownicon>
							<Icon
								name="material-symbols:arrow-drop-down-circle-outline"
								class="text-lg"
							/>
						</template>
					</prime-select>
					<label :for="`select-${index}`">{{ select.label }}</label>
				</prime-float-label>
			</template>
			<template #sidebar-2-header>Tournaments</template>
			<template #sidebar-2-content>
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
		<div>
			<page-title>
				<template #heading>Upcoming Tournaments</template>
			</page-title>
			<prime-toolbar v-show="!lgAndUp">
				<template #start>
					<div class="flex flex-wrap gap-2">
						<prime-float-label
							v-for="(select, index) in selectOptions"
							:key="select.label"
							class="w-fit min-w-24"
							variant="on"
						>
							<prime-select
								:inputId="`select-${index}`"
								v-model="select.vModel"
								:options="select.options"
								option-label="label"
								option-value="value"
								class="w-full"
								size="small"
							>
								<template #dropdownicon>
									<Icon
										name="material-symbols:arrow-drop-down-circle-outline"
										class="text-lg"
									/>
								</template>
							</prime-select>
							<label :for="`select-${index}`">{{ select.label }}</label>
						</prime-float-label>
					</div>
				</template>
			</prime-toolbar>
			<div
				v-if="events && events.length > 0"
				class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-10 mt-5"
			>
				<ClientOnly>
					<event-card
						v-for="event in events"
						:key="event.eid"
						:event="event"
					/>
				</ClientOnly>
			</div>
			<error-message
				v-else
				:status
				error-icon="pepicons-print:calendar-circle-off"
			>
				<template #loading-message>Events are currently being fetched</template>
				<template #error-message>There are no upcoming events</template>
			</error-message>
		</div>
	</div>
</template>
