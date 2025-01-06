<script setup lang="ts">
import { breakpointsTailwind } from "@vueuse/core";
const route = useRoute();
const pname = computed(() => route.params.pname);
const pid = computed(() => route.params.pid);

const breakpoints = useBreakpoints(breakpointsTailwind);
const lgAndUp = breakpoints.greaterOrEqual("lg");

const pageName = computed(() => {
	const filteredPage = PLAYER_PAGES.find((page) => page.name === route.name);
	return filteredPage?.title || "";
});

const pageIcon = computed(() => {
	const filteredPage = PLAYER_PAGES.find((page) => page.name === route.name);
	return filteredPage?.icon || "";
});

useHead({ title: `${pageName.value} | ${unencodeName(pname.value)}` });
</script>

<template>
	<div class="w-full">
		<ClientOnly>
			<shadcn-breadcrumb class="my-5">
				<shadcn-breadcrumb-list>
					<shadcn-breadcrumb-item>
						<shadcn-breadcrumb-link as-child>
							<Icon name="i-ph-house-duotone" />
							<nuxt-link to="/">Home</nuxt-link>
						</shadcn-breadcrumb-link>
					</shadcn-breadcrumb-item>
					<shadcn-breadcrumb-separator />
					<shadcn-breadcrumb-item>Players</shadcn-breadcrumb-item>
					<shadcn-breadcrumb-separator />
					<shadcn-breadcrumb-item>
						{{ unencodeName(pname) }}
					</shadcn-breadcrumb-item>
					<shadcn-breadcrumb-separator />
					<shadcn-breadcrumb-item>
						<shadcn-breadcrumb-page class="flex items-center gap-1">
							<Icon :name="pageIcon" />
							{{ pageName }}
						</shadcn-breadcrumb-page>
					</shadcn-breadcrumb-item>
				</shadcn-breadcrumb-list>
			</shadcn-breadcrumb>
		</ClientOnly>
		<page-title>
			<template #heading>{{ unencodeName(pname) }}</template>
			<template #subheading>{{ pageName }}</template>
		</page-title>
		<prime-toolbar v-show="!lgAndUp">
			<template #center>
				<div class="flex flex-wrap md:items-center md:justify-center items-end gap-2">
					<template
						v-for="page in PLAYER_PAGES"
						:key="page.title"
					>
						<shadcn-button
							size="xs"
							class="rounded-full"
							as-child
						>
							<div>
								<icon :name="page.icon" />
								<nuxt-link
									:to="{ name: page.name, params: { pname: pname, pid: pid } }"
									exact-active-class="text-emerald-600"
								>
									{{ page.title }}
								</nuxt-link>
							</div>
						</shadcn-button>
					</template>
				</div>
			</template>
		</prime-toolbar>
		<slot />
	</div>
</template>
