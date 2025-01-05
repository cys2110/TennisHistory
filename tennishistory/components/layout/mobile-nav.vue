<template>
	<div class="flex justify-between items-center p-3 bg-violet-800 fixed top-0 w-full z-50">
		<div class="text-2xl font-['Petit_Formal_Script'] text-center font-bold text-zinc-300">TennisHistory</div>
		<shadcn-drawer>
			<shadcn-drawer-trigger as-child>
				<shadcn-button
					size="icon"
					variant="ghost"
				>
					<icon
						name="solar:hamburger-menu-line-duotone"
						class="text-zinc-300"
					/>
				</shadcn-button>
			</shadcn-drawer-trigger>
			<shadcn-drawer-content class="p-5 text-center">
				<shadcn-drawer-header>Menu</shadcn-drawer-header>
				<div class="flex flex-col gap-3">
					<nuxt-link
						v-for="link in NAVIGATION_LINKS"
						:key="link.label"
						:to="link.to"
					>
						{{ link.label }}
					</nuxt-link>
				</div>
			</shadcn-drawer-content>
		</shadcn-drawer>
	</div>
</template>
