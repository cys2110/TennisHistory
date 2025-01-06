<script setup lang="ts">
import { breakpointsTailwind } from "@vueuse/core";
definePageMeta({ name: "player" });
const route = useRoute();
const showMessage: Ref<string | boolean> = ref("");

const breakpoints = useBreakpoints(breakpointsTailwind);
const lgAndUp = breakpoints.greaterOrEqual("lg");
</script>

<template>
	<div class="lg:flex gap-5">
		<sidebar-nav v-show="lgAndUp">
			<template #sidebar-1-header>Related pages</template>
			<template #sidebar-1-content>
				<shadcn-sidebar-menu>
					<shadcn-sidebar-menu-item
						v-for="page in PLAYER_PAGES"
						:key="page.title"
					>
						<shadcn-sidebar-menu-button as-child>
							<nuxt-link
								class="hover-link flex items-center gap-1"
								:to="{ name: page.name, params: { pname: route.params.pname, pid: route.params.pid } }"
								active-class="text-emerald-600"
							>
								<icon :name="page.icon" />
								<span>{{ page.title }}</span>
							</nuxt-link>
						</shadcn-sidebar-menu-button>
					</shadcn-sidebar-menu-item>
				</shadcn-sidebar-menu>
			</template>
		</sidebar-nav>
		<player-layout>
			<player-overview @update:show-message="showMessage = $event" />
			<player-best-results @update:show-message="showMessage = $event" />
			<error-message
				v-if="showMessage === 'pending' || showMessage === 'error'"
				:status="showMessage"
				error-icon="material-symbols:person-off-outline-rounded"
			>
				<template #loading-message>Player details are currently being fetched</template>
				<template #error-message>No player information available</template>
			</error-message>
		</player-layout>
	</div>
</template>
