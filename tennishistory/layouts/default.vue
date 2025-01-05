<script setup>
import { breakpointsTailwind } from "@vueuse/core";
const breakpoints = useBreakpoints(breakpointsTailwind);
const lgAndUp = breakpoints.greaterOrEqual("lg");
</script>

<template>
	<div class="flex flex-col min-h-svh bg-gray-100 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-300">
		<mobile-nav v-show="!lgAndUp" />
		<div class="flex min-h-full flex-1">
			<div class="py-24 px-5 w-11/12 mx-auto">
				<slot />
				<prime-scroll-top />
			</div>
		</div>
		<mobile-footer v-show="!lgAndUp" />
	</div>
</template>
