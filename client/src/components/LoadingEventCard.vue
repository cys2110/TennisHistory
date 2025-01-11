<script setup lang="ts">
// defineProps<{ loading: boolean }>()
</script>

<template>
	<el-card class="!bg-transparent !border-2 !border-violet-600 !shadow-md !shadow-violet-500 hover:!shadow-lg hover:!shadow-violet-500 !rounded-xl !py-2">
		<template #header>
			<el-skeleton style="--el-skeleton-circle-size: 50px" animated :throttle="300">
				<template #template>
					<div class="flex gap-3 items-center">
						<el-skeleton-item variant="circle" />
						<el-skeleton-item variant="h1" />
					</div>
				</template>
			</el-skeleton>
			<el-divider class="!border-slate-500" />
		</template>
		<div class="!text-slate-700 dark:!text-slate-300 text-sm">
			<el-skeleton v-for="i in new Array(3)" :key="i" animated :throttle="300">
				<template #template>
					<el-skeleton-item variant="text" />
				</template>
			</el-skeleton>
		</div>
		<template #footer>
			<el-skeleton animated :throttle="300" :count="3" class="flex justify-evenly">
				<template #template>
					<el-skeleton-item variant="button" />
				</template>
			</el-skeleton>
		</template>
	</el-card>
</template>

<style>
.el-card__header {
	@apply !border-none;
}

.el-card__footer {
	@apply !border-none;
}

.el-skeleton__item {
	--el-skeleton-color: theme(colors.slate.400);
	--el-skeleton-to-color: theme(colors.slate.300);

	@media (prefers-color-scheme: dark) {
		--el-skeleton-color: theme(colors.slate.800);
		--el-skeleton-to-color: theme(colors.slate.600);
	}
}

.el-skeleton__button {
	height: 20px;
}
</style>
