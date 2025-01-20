<script setup lang="ts">
const modelValue = defineModel<CategoryEnum[]>();
</script>

<template>
	<u-select
		v-model="modelValue"
		multiple
		:items="FILTERED_CATEGORIES"
		icon="i-material-symbols-trophy-rounded"
		class="w-full"
	/>
</template>
