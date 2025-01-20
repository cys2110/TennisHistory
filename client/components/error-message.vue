<script setup lang="ts">
defineProps<{ status: string; error: any; icon: string }>();
// TODO: Add toast for error
</script>

<template>
	<u-alert
		variant="subtle"
		:color="status === 'pending' ? 'primary' : 'warning'"
		:icon="status === 'pending' ? 'i-line-md-loading-twotone-loop' : icon"
		:ui="{ icon: 'size-6', title: 'text-lg', root: 'w-3/4 mx-auto' }"
	>
		<template #title>
			<slot
				v-if="status === 'pending'"
				name="pending"
			/>
			<slot
				v-else
				name="error"
			/>
		</template>
	</u-alert>
</template>
