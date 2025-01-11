<template>
	<el-page-header class="my-10 page-title" icon="">
		<template #breadcrumb v-if="$slots.breadcrumb">
			<slot name="breadcrumb" />
		</template>
		<template #title>
			<div class="text-3xl text-slate-700 dark:text-slate-400">
				<slot name="heading" />
			</div>
		</template>
		<template #content>
			<div class="text-slate-600 dark:text-slate-500">
				<slot name="subtitle" />
			</div>
		</template>
		<slot />
	</el-page-header>
</template>

<style>
.el-page-header__left > .el-divider--vertical {
	@apply !border-none;
}

.el-page-header__main {
	@apply !border-none;
}
</style>
