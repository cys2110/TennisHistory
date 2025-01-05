<script setup lang="ts">
const route = useRoute();
const sidebar1Pages = ["home"];
const sidebar2Pages = ["home"];
</script>

<template>
	<div>
		<shadcn-sidebar-provider collapsible="none">
			<shadcn-sidebar>
				<shadcn-sidebar-header class="py-12 text-2xl font-['Petit_Formal_Script'] text-center font-bold">TennisHistory</shadcn-sidebar-header>
				<shadcn-sidebar-content class="scrollbar scrollbar-thumb-emerald-600 scrollbar-track-transparent pt-5">
					<shadcn-sidebar-group>
						<shadcn-sidebar-group-label>Navigation</shadcn-sidebar-group-label>
						<shadcn-sidebar-group-content>
							<shadcn-sidebar-menu>
								<shadcn-sidebar-menu-item
									v-for="link in NAVIGATION_LINKS"
									:key="link.label"
								>
									<shadcn-sidebar-menu-button as-child>
										<nuxt-link
											class="hover-link flex items-center gap-1"
											:to="link.to"
											active-class="text-emerald-600"
										>
											<Icon :name="link.icon" />
											<span>{{ link.label }}</span>
										</nuxt-link>
									</shadcn-sidebar-menu-button>
								</shadcn-sidebar-menu-item>
							</shadcn-sidebar-menu>
						</shadcn-sidebar-group-content>
					</shadcn-sidebar-group>
					<shadcn-sidebar-group v-if="sidebar1Pages.includes(route.name as string)">
						<shadcn-sidebar-group-label>
							<slot name="sidebar-1-header" />
						</shadcn-sidebar-group-label>
						<shadcn-sidebar-group-content>
							<slot name="sidebar-1-content" />
						</shadcn-sidebar-group-content>
					</shadcn-sidebar-group>
					<shadcn-sidebar-group v-if="sidebar2Pages.includes(route.name as string)">
						<shadcn-sidebar-group-label>
							<slot name="sidebar-2-header" />
						</shadcn-sidebar-group-label>
						<shadcn-sidebar-group-content>
							<slot name="sidebar-2-content" />
						</shadcn-sidebar-group-content>
					</shadcn-sidebar-group>
					<shadcn-sidebar-group>
						<shadcn-sidebar-group-label>Related websites</shadcn-sidebar-group-label>
						<shadcn-sidebar-group-content>
							<shadcn-sidebar-menu>
								<shadcn-sidebar-menu-item
									v-for="link in RELATED_LINKS"
									:key="link.name"
								>
									<shadcn-sidebar-menu-button as-child>
										<nuxt-link
											class="hover-link"
											:to="link.url"
											target="_blank"
										>
											{{ link.name }}
										</nuxt-link>
									</shadcn-sidebar-menu-button>
								</shadcn-sidebar-menu-item>
							</shadcn-sidebar-menu>
						</shadcn-sidebar-group-content>
					</shadcn-sidebar-group>
				</shadcn-sidebar-content>
				<shadcn-sidebar-footer class="text-center pb-5 px-3 text-sm dark:text-zinc-400">
					Built by
					<nuxt-link
						class="hover-link text-emerald-600"
						to="https://www.claire-sheridan.com"
						target="_blank"
					>
						Claire Sheridan
					</nuxt-link>
					using Nuxt, PrimeVue, Shadcn Vue and TailwindCSS
				</shadcn-sidebar-footer>
			</shadcn-sidebar>
		</shadcn-sidebar-provider>
	</div>
</template>
