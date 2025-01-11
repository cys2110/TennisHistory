<script setup lang="ts">
defineProps<{ icon: string[] }>()
</script>

<template>
	<el-alert center class="!bg-transparent !border !border-amber-600" :closable="false">
		<font-awesome-icon :icon class="mr-2 text-amber-600 text-base" />
		<span class="text-amber-600 text-base">
			<slot name="message" />
		</span>
	</el-alert>
</template>
