<script setup lang="ts">
defineProps<{
	page?: {
		title: string;
		icon: string;
	};
	round?: string;
	p1?: string;
	p2?: string;
}>();
const route = useRoute();
const tname = computed(() => route.params.tname);
const tid = computed(() => route.params.tid);
const year = computed(() => route.params.year || "");
const eid = computed(() => route.params.eid || "");

const eventPages = ["event", "results", "draw"];
const tournamentParams = computed(() => {
	return { tname: encodeName(tname.value), tid: tid.value };
});
const eventParams = computed(() => {
	return { ...tournamentParams.value, year: year.value, eid: eid.value };
});
</script>

<template>
	<shadcn-breadcrumb>
		<shadcn-breadcrumb-list>
			<shadcn-breadcrumb-item>
				<shadcn-breadcrumb-link as-child>
					<nuxt-link
						to="/"
						class="flex items-center text-lg"
					>
						<Icon name="i-ph-house-duotone" />
					</nuxt-link>
				</shadcn-breadcrumb-link>
			</shadcn-breadcrumb-item>
			<shadcn-breadcrumb-separator />
			<shadcn-breadcrumb-item> Tournaments </shadcn-breadcrumb-item>
			<shadcn-breadcrumb-separator />
			<template v-if="eventPages.includes(route.name as string)">
				<shadcn-breadcrumb-item>
					<shadcn-breadcrumb-link as-child>
						<nuxt-link :to="{ name: 'tournament', params: tournamentParams }">{{ unencodeName(tname) }}</nuxt-link>
					</shadcn-breadcrumb-link>
				</shadcn-breadcrumb-item>
				<shadcn-breadcrumb-separator />
				<shadcn-breadcrumb-item>{{ year }}</shadcn-breadcrumb-item>
				<shadcn-breadcrumb-separator />
			</template>
			<template v-if="route.name === 'match' && round">
				<shadcn-breadcrumb-item>
					<shadcn-breadcrumb-link as-child>
						<nuxt-link :to="{ name: 'tournament', params: tournamentParams }">{{ unencodeName(tname) }}</nuxt-link>
					</shadcn-breadcrumb-link>
				</shadcn-breadcrumb-item>
				<shadcn-breadcrumb-separator />
				<shadcn-breadcrumb-item>
					<shadcn-breadcrumb-link as-child>
						<nuxt-link :to="{ name: 'event', params: eventParams }">{{ year }}</nuxt-link>
					</shadcn-breadcrumb-link>
				</shadcn-breadcrumb-item>
				<shadcn-breadcrumb-separator />
				<shadcn-breadcrumb-item>{{ round }}</shadcn-breadcrumb-item>
				<shadcn-breadcrumb-separator />
			</template>
			<shadcn-breadcrumb-item>
				<shadcn-breadcrumb-page class="flex items-center gap-1">
					<template v-if="route.name === 'tournament'">{{ unencodeName(tname) }}</template>
					<template v-else-if="eventPages.includes(route.name as string) && page">
						<Icon :name="page.icon" />
						<span>{{ page.title }}</span>
					</template>
					<template v-else-if="route.name === 'match' && p1 && p2">
						<span>{{ p1 }} v. {{ p2 }}</span>
					</template>
				</shadcn-breadcrumb-page>
			</shadcn-breadcrumb-item>
		</shadcn-breadcrumb-list>
	</shadcn-breadcrumb>
</template>
