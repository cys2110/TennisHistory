<script setup lang="ts">
defineProps<{ items: string[] }>();
const modelValue = defineModel<string[]>();
</script>

<template>
	<u-select
		v-model="modelValue"
		multiple
		:items
		icon="i-material-symbols-calendar-today-rounded"
		class="w-full"
	/>
</template>
