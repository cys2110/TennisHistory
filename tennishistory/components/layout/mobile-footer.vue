<template>
	<div class="bg-violet-800 text-sm py-2">
		<div class="flex flex-col gap-2 text-zinc-400 items-center py-2">
			<nuxt-link
				v-for="link in RELATED_LINKS"
				:key="link.name"
				:to="link.url"
				target="_blank"
			>
				{{ link.name }}
			</nuxt-link>
		</div>
		<div class="text-center text-zinc-400">
			Built by
			<span>
				<nuxt-link
					class="hover-link text-emerald-600"
					to="https://www.claire-sheridan.com"
					target="_blank"
				>
					Claire Sheridan
				</nuxt-link>
			</span>
			using Nuxt, PrimeVue, Shadcn Vue and TailwindCSS
		</div>
	</div>
</template>
