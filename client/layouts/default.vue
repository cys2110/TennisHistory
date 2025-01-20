<script setup lang="ts">
import { breakpointsTailwind } from "@vueuse/core";

const breakpoints = useBreakpoints(breakpointsTailwind);
const md = breakpoints.md;
const lgAndUp = breakpoints.greaterOrEqual("lg");
</script>

<template>
	<u-page>
		<ClientOnly>
			<u-header
				class="lg:hidden"
				title="TennisHistory"
				:toggle="{ color: 'neutral', class: 'rounded-full', icon: 'i-solar-hamburger-menu-line-duotone' }"
				:ui="{ root: 'bg-violet-800', title: 'font-cursive text-slate-300' }"
			>
				<template #content>
					<u-navigation-menu
						:items="NAVIGATION_LINKS"
						color="primary"
						highlight
					/>
				</template>
			</u-header>
		</ClientOnly>
		<template #left>
			<u-page-aside :ui="{ root: 'border-r lg:top-0 lg:max-h-screen', container: 'px-5 absolute h-full' }">
				<template #top>
					<span class="font-cursive text-lg xl:text-2xl 2xl:text-3xl mx-auto">TennisHistory</span>
				</template>
				<div class="h-full">
					<u-page-links
						title="Navigation"
						:links="NAVIGATION_LINKS"
						class="my-5"
						:ui="{ item: 'ml-5' }"
					/>
					<u-page-links
						title="Related Websites"
						:links="RELATED_LINKS"
						:ui="{ item: 'ml-5' }"
					/>
				</div>
				<template #bottom>
					<div class="text-center text-sm mt-auto">
						Built by
						<nuxt-link
							class="text-emerald-600"
							to="https://www.claire-sheridan.com"
							target="_blank"
						>
							Claire Sheridan
						</nuxt-link>
						using Nuxt, Nuxt UI Pro and TypeScript.
					</div>
				</template>
			</u-page-aside>
		</template>
		<u-main>
			<slot />
		</u-main>
		<ClientOnly>
			<u-footer
				class="lg:hidden"
				:ui="{ root: 'bg-violet-800', container: 'p-0 pb-2' }"
			>
				<u-navigation-menu
					:items="RELATED_LINKS"
					:orientation="md ? 'horizontal' : 'vertical'"
				/>
				<template #bottom>
					<div class="p-3 text-center text-sm text-slate-400">
						Built by
						<nuxt-link
							class="text-emerald-600"
							to="https://www.claire-sheridan.com"
							target="_blank"
						>
							Claire Sheridan
						</nuxt-link>
						using Nuxt, Nuxt UI Pro and TypeScript.
					</div>
				</template>
			</u-footer>
		</ClientOnly>
	</u-page>
</template>

<style scoped></style>
