<script setup lang="ts">
const modelValue = defineModel<SurfaceEnum[]>();
</script>

<template>
	<u-select
		v-model="modelValue"
		multiple
		:items="FILTERED_SURFACES"
		icon="i-game-icons-tennis-court"
		class="w-full"
	/>
</template>
