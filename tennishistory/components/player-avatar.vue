<script setup lang="ts">
defineProps<{ id: string; name: string }>();
</script>

<template>
	<shadcn-avatar class="border border-zinc-400">
		<shadcn-avatar-image
			:src="`https://www.atptour.com/-/media/alias/player-headshot/${id}`"
			:alt="name"
		/>
		<shadcn-avatar-fallback>
			<Icon name="material-symbols:person-rounded" />
		</shadcn-avatar-fallback>
	</shadcn-avatar>
</template>
