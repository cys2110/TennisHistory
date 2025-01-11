<script setup lang="ts">
import { breakpointsTailwind } from '@vueuse/core'
const mode = useColorMode()
const breakpoints = useBreakpoints(breakpointsTailwind)
const lgAndUp = breakpoints.greaterOrEqual('lg')
</script>

<template>
	<el-container class="h-screen">
		<el-header v-if="!lgAndUp" class="bg-violet-800 flex justify-between items-center">
			<div class="header text-3xl text-slate-300">TennisHistory</div>
			<el-dropdown size="small" trigger="click" popper-class="!border-none">
				<font-awesome-icon :icon="['fad', 'bars']" class="text-slate-300" />
				<template #dropdown>
					<el-dropdown-menu>
						<el-dropdown-item v-for="link in NAVIGATION_LINKS" :key="link.label">
							<router-link :to="link.to">
								<font-awesome-icon :icon="link.icon" />
								<span>{{ link.label }}</span>
							</router-link>
						</el-dropdown-item>
					</el-dropdown-menu>
				</template>
			</el-dropdown>
		</el-header>
		<el-container>
			<el-aside v-if="lgAndUp">
				<el-container class="h-screen fixed !w-72">
					<el-header class="border-r !py-10">
						<div class="header text-3xl text-center">TennisHistory</div>
					</el-header>
					<el-menu mode="vertical" class="!bg-transparent !h-full !py-10">
						<el-menu-item-group>
							<template #title>
								<span class="text-lg text-slate-800 dark:text-slate-400"> Navigation </span>
							</template>
							<el-menu-item v-for="link in NAVIGATION_LINKS" :key="link.label" class="ml-5 dark:hover:bg-slate-800 rounded-lg !h-10">
								<router-link :to="link.to" active-class="!text-emerald-700 dark:!text-emerald-600" class="flex items-center gap-2">
									<font-awesome-icon :icon="link.icon" />
									<span>{{ link.label }}</span>
								</router-link>
							</el-menu-item>
						</el-menu-item-group>
						<el-menu-item-group>
							<template #title>
								<span class="text-lg text-slate-800 dark:text-slate-400">Related websites</span>
							</template>
							<el-menu-item v-for="link in RELATED_LINKS" :key="link.name" class="ml-5 dark:hover:bg-slate-800 rounded-lg !h-8">
								<a :href="link.url" target="_blank">
									{{ link.name }}
								</a>
							</el-menu-item>
						</el-menu-item-group>
					</el-menu>
					<el-footer class="border-r">
						<div class="flex justify-center items-center flex-wrap text-center text-sm">
							Built by &nbsp;
							<span>
								<a class="text-emerald-600" href="//www.claire-sheridan.com" target="_blank"> Claire Sheridan </a>
							</span>
							using Vue.js, Element Plus and TailwindCSS
						</div>
					</el-footer>
				</el-container>
			</el-aside>
			<el-main>
				<router-view />
			</el-main>
		</el-container>
		<el-footer v-if="!lgAndUp" class="bg-violet-800 flex flex-col justify-center items-center">
			<div class="flex flex-col gap-2 items-center py-2">
				<a v-for="link in RELATED_LINKS" :key="link.name" :href="link.url" target="_blank" class="text-slate-300 text-sm">
					{{ link.name }}
				</a>
			</div>
			<div class="flex justify-center items-center flex-wrap text-center text-sm text-slate-300">
				Built by &nbsp;
				<span>
					<a class="text-emerald-600" href="https://www.claire-sheridan.com" target="_blank"> Claire Sheridan </a>
				</span>
				using Vue.js, Shadcn-Vue, Element Plus and TailwindCSS
			</div>
		</el-footer>
	</el-container>
</template>

<style lang="css">
@import url('https://fonts.googleapis.com/css2?family=Petit+Formal+Script&display=swap');

.header {
	font-family: 'Petit Formal Script', cursive;
}
</style>
