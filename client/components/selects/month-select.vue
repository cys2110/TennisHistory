<script setup lang="ts">
const modelValue = defineModel<MonthNameEnum[]>();
</script>

<template>
	<u-select
		v-model="modelValue"
		multiple
		:items="MONTH_NAMES"
		icon="i-material-symbols-calendar-today-rounded"
		class="w-full"
	/>
</template>
