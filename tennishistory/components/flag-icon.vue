<script setup lang="ts">
const props = defineProps<{ country: string; size?: string }>();

const getCountryCode = () => {
	const key = Object.keys(COUNTRY_CODES).find((key) => COUNTRY_CODES[key as keyof typeof COUNTRY_CODES] === props.country);
	return key || false;
};
</script>

<template>
	<icon
		v-if="getCountryCode()"
		:name="`flag:${getCountryCode()}-4x3`"
		class="border border-zinc-500 rounded"
		:class="size"
	/>
	<component
		v-else
		:is="country"
	/>
</template>
