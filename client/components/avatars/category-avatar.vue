<script setup lang="ts">
defineProps<{ category: string; class?: string }>();
</script>

<template>
	<u-avatar
		:src="`/category/${category}.svg`"
		:class
		:alt="category"
		size="3xl"
		icon="i-material-symbols-trophy-rounded"
		:ui="{ root: 'bg-slate-300', image: 'object-contain' }"
	/>
</template>
